const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal');

/**
 * @swagger
 * tags:
 *   name: Journal
 *   description: Journal entries management
 */

/**
 * @swagger
 * /journal:
 *   get:
 *     summary: List all journal entries
 *     tags: [Journal]
 *     responses:
 *       200:
 *         description: List of all journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/JournalEntry' }
 */
router.get('/', journalController.list.bind(journalController));

/**
 * @swagger
 * /journal:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journal]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalEntryInput'
 *     responses:
 *       201:
 *         description: The created entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 */
router.post('/', journalController.create.bind(journalController));

/**
 * @swagger
 * /journal/search:
 *   get:
 *     summary: Search journal entries
 *     tags: [Journal]
 *     parameters:
 *       - name: text
 *         in: query
 *         schema:
 *           type: string
 *         description: Text to search (in Markdown body)
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Entry date (yyyy-mm-dd)
 *       - name: mood
 *         in: query
 *         schema:
 *           type: string
 *         description: Mood tag to match
 *     responses:
 *       200:
 *         description: Matching entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/JournalEntry' }
 */
router.get('/search', journalController.search.bind(journalController));

/**
 * @swagger
 * /journal/{id}:
 *   get:
 *     summary: Get a single entry by ID
 *     tags: [Journal]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Entry ID
 *     responses:
 *       200:
 *         description: The entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       404:
 *         description: Entry not found
 */
router.get('/:id', journalController.get.bind(journalController));

/**
 * @swagger
 * /journal/{id}:
 *   put:
 *     summary: Update an entry by ID
 *     tags: [Journal]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Entry ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalEntryInput'
 *     responses:
 *       200:
 *         description: The updated entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       404:
 *         description: Entry not found
 */
router.put('/:id', journalController.update.bind(journalController));

/**
 * @swagger
 * /journal/{id}:
 *   delete:
 *     summary: Delete entry by ID
 *     tags: [Journal]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Entry ID
 *     responses:
 *       200:
 *         description: Entry deleted
 *       404:
 *         description: Entry not found
 */
router.delete('/:id', journalController.delete.bind(journalController));

module.exports = router;
