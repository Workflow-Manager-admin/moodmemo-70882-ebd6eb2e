const express = require('express');
const healthController = require('../controllers/health');
const journalRoutes = require('./journal');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     JournalEntryInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: Markdown content of the entry
 *         date:
 *           type: string
 *           format: date
 *           description: Date (yyyy-mm-dd)
 *         moods:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of mood tags (e.g. ["happy", "excited"])
 *     JournalEntry:
 *       allOf:
 *         - $ref: '#/components/schemas/JournalEntryInput'
 *         - type: object
 *           required: [id, wordCount, moods, date]
 *           properties:
 *             id:
 *               type: string
 *             date:
 *               type: string
 *               format: date
 *             wordCount:
 *               type: integer
 *               description: The number of words in content
 *             moods:
 *               type: array
 *               items:
 *                 type: string

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

router.use('/journal', journalRoutes);

module.exports = router;
