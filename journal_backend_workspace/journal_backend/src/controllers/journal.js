const journalService = require('../services/journal');

/**
 * Exposes CRUD and search operations for journal entries.
 * All methods call the corresponding service and handle API responses.
 */
class JournalController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    try {
      const entries = await journalService.listEntries();
      res.json(entries);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    try {
      const entry = await journalService.getEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      res.json(entry);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    try {
      const { content, date, moods, title } = req.body;
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: 'Content is required (Markdown text).' });
      }
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'Title is required (non-empty string).' });
      }
      const entry = await journalService.createEntry({ content, date, moods, title });
      res.status(201).json(entry);
    } catch (err) {
      if (err.status && err.expose) {
        res.status(err.status).json({ message: err.message });
      } else {
        next(err);
      }
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    try {
      const { content, date, moods, title } = req.body;
      const entry = await journalService.updateEntry(req.params.id, { content, date, moods, title });
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      res.json(entry);
    } catch (err) {
      if (err.status && err.expose) {
        res.status(err.status).json({ message: err.message });
      } else {
        next(err);
      }
    }
  }

  // PUBLIC_INTERFACE
  async delete(req, res, next) {
    try {
      const deleted = await journalService.deleteEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      res.json({ message: 'Entry deleted' });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async search(req, res, next) {
    try {
      const { text, date, mood } = req.query;
      const results = await journalService.searchEntries({ text, date, mood });
      res.json(results);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async totalWordCount(req, res, next) {
    /**
     * Returns the aggregate word count for all entries.
     * Response format: { totalWordCount: number }
     */
    try {
      const total = await journalService.getTotalWordCount();
      res.json({ totalWordCount: total });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async trendingMoods(req, res, next) {
    /**
     * Returns trending moods, optionally limiting results.
     * Query param: top (number of moods), default=5
     * Response format: { trendingMoods: [{ mood, count }] }
     */
    try {
      const top = req.query.top ? parseInt(req.query.top, 10) : 5;
      const moods = await journalService.getTrendingMoods({ top });
      res.json({ trendingMoods: moods });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new JournalController();
