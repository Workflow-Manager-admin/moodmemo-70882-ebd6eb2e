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
      const { content, date, moods } = req.body;
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: 'Content is required (Markdown text).' });
      }
      const entry = await journalService.createEntry({ content, date, moods });
      res.status(201).json(entry);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    try {
      const { content, date, moods } = req.body;
      const entry = await journalService.updateEntry(req.params.id, { content, date, moods });
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      res.json(entry);
    } catch (err) {
      next(err);
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
}

module.exports = new JournalController();
