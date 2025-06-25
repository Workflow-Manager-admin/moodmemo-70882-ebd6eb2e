const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ENTRIES_DIR = path.join(__dirname, '..', '..', 'entries');

// Ensure entries directory exists
if (!fs.existsSync(ENTRIES_DIR)) {
  fs.mkdirSync(ENTRIES_DIR, { recursive: true });
}

/**
 * Helpers for handling entries as .md files with metadata frontmatter and Markdown body.
 * The frontmatter now includes: id, title, date, moods (array).
 */
function parseEntryFile(content) {
  // Expected format (title required):
  // ---
  // id: xxx
  // title: Entry title
  // date: yyyy-mm-dd
  // moods: ["happy","excited"]
  // ---
  // (markdown body)
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/m.exec(content);
  if (!match) return null;

  const metaBlock = match[1];
  const body = match[2];
  const metadata = {};
  metaBlock.split('\n').forEach(line => {
    // Only split on the first colon
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1).trim();
    if (key === 'moods') {
      try {
        metadata.moods = JSON.parse(rawValue.replace(/'/g, '"'));
      } catch {
        metadata.moods = rawValue.replace(/[\[\]]/g, '').split(',').filter(Boolean).map(s => s.trim());
      }
    } else {
      metadata[key] = rawValue;
    }
  });
  metadata.wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  return {
    ...metadata,
    content: body,
  };
}

function buildEntryFile(metadata, markdownContent) {
  // Include required title property
  return (
    '---\n'
    + 'id: ' + metadata.id + '\n'
    + 'title: ' + (metadata.title || '') + '\n'
    + 'date: ' + metadata.date + '\n'
    + 'moods: ' + JSON.stringify(metadata.moods || []) + '\n'
    + '---\n'
    + markdownContent.trim() + '\n'
  );
}

class JournalService {
  // PUBLIC_INTERFACE
  async listEntries() {
    /** Return all entries (with metadata and word count), sorted by date descending. */
    const files = fs.readdirSync(ENTRIES_DIR).filter(f => f.endsWith('.md'));
    const entries = [];
    for (const file of files) {
      const fileContent = fs.readFileSync(path.join(ENTRIES_DIR, file), 'utf-8');
      const entry = parseEntryFile(fileContent);
      if (entry) {
        entries.push(entry);
      }
    }
    // Sort by date descending
    return entries.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  // PUBLIC_INTERFACE
  async getTotalWordCount() {
    /** Returns the total word count of all journal entries */
    const entries = await this.listEntries();
    return entries.reduce((total, entry) => total + (parseInt(entry.wordCount, 10) || 0), 0);
  }

  // PUBLIC_INTERFACE
  async getTrendingMoods({ top = 5 } = {}) {
    /**
     * Returns an array of mood objects {mood, count}, sorted by frequency descending.
     * Example: [{ mood: 'happy', count: 8 }, ...]
     */
    const entries = await this.listEntries();
    const moodCounts = {};
    for (const entry of entries) {
      (entry.moods || []).forEach(mood => {
        if (mood && mood.trim()) {
          const key = mood.trim().toLowerCase();
          moodCounts[key] = (moodCounts[key] || 0) + 1;
        }
      });
    }
    const result = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, top);
    return result;
  }

  // PUBLIC_INTERFACE
  async getEntry(id) {
    /** Return a single entry by ID, or null if not found */
    const filePath = path.join(ENTRIES_DIR, `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return parseEntryFile(content);
  }

  // PUBLIC_INTERFACE
  async createEntry({ content, date, moods, title }) {
    /**
     * Create a new entry, assign UUID, save to .md file,
     * return resulting entry including word count/moods/id/date/content/title
     */
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw Object.assign(new Error('Title is required.'), { status: 400, expose: true });
    }
    const id = uuidv4();
    const now = date || (new Date()).toISOString().slice(0, 10);
    const sanitizedContent = (content || '').trim();
    const sanitizedTitle = title.trim();
    const entryMeta = {
      id,
      title: sanitizedTitle,
      date: now,
      moods: Array.isArray(moods) ? moods : (typeof moods === 'string' ? [moods] : []),
    };
    const fileContent = buildEntryFile(entryMeta, sanitizedContent);
    fs.writeFileSync(path.join(ENTRIES_DIR, `${id}.md`), fileContent, 'utf-8');
    return { ...entryMeta, content: sanitizedContent, wordCount: sanitizedContent.split(/\s+/).filter(Boolean).length };
  }

  // PUBLIC_INTERFACE
  async updateEntry(id, { content, date, moods, title }) {
    /**
     * Update an entry if exists, return updated entry, or null if not found.
     * Allows updating title, content, date, or moods (partial OK).
     */
    const filePath = path.join(ENTRIES_DIR, `${id}.md`);
    if (!fs.existsSync(filePath)) return null;
    // Read old metadata
    const oldEntry = parseEntryFile(fs.readFileSync(filePath, 'utf-8'));
    if (!oldEntry) return null;
    const newMeta = {
      id,
      title: (typeof title !== 'undefined' ? title : oldEntry.title) || '',
      date: date || oldEntry.date,
      moods: (typeof moods !== 'undefined' ? moods : oldEntry.moods) || [],
    };
    const newContent = typeof content !== 'undefined' ? content : oldEntry.content;
    const fileContent = buildEntryFile(newMeta, newContent);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    return { ...newMeta, content: newContent, wordCount: newContent.trim().split(/\s+/).filter(Boolean).length };
  }

  // PUBLIC_INTERFACE
  async deleteEntry(id) {
    /** Delete entry by ID. Returns true if deleted, false if not found. */
    const filePath = path.join(ENTRIES_DIR, `${id}.md`);
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
  }

  // PUBLIC_INTERFACE
  async searchEntries({ text, date, mood }) {
    /**
     * Search entries by text (in body), date, title, or mood.
     * Returns matching entries (with wordCount, moods, etc).
     */
    const files = fs.readdirSync(ENTRIES_DIR).filter(f => f.endsWith('.md'));
    const results = [];
    for (const file of files) {
      const fileContent = fs.readFileSync(path.join(ENTRIES_DIR, file), 'utf-8');
      const entry = parseEntryFile(fileContent);
      if (!entry) continue;
      let keep = true;
      if (typeof text === 'string' && text.trim() !== '') {
        // Now search in title and content
        if (
          !(entry.content.toLowerCase().includes(text.toLowerCase()))
          && !(entry.title && entry.title.toLowerCase().includes(text.toLowerCase()))
        ) {
          keep = false;
        }
      }
      if (typeof date === 'string' && date.trim() !== '') {
        if (entry.date !== date) keep = false;
      }
      if (typeof mood === 'string' && mood.trim() !== '') {
        if (!((entry.moods || []).map(m => m.toLowerCase()).includes(mood.toLowerCase()))) {
          keep = false;
        }
      }
      if (keep) results.push(entry);
    }
    return results.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }
}

module.exports = new JournalService();
