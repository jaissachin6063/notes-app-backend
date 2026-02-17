const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notesController = require('../controllers/notesController');

// Search route must come BEFORE /:id route
router.get('/search', protect, notesController.searchNotes);

// CRUD routes
router.get('/', protect, notesController.getAllNotes);
router.get('/:id', protect, notesController.getNoteById);
router.post('/', protect, notesController.createNote);
router.put('/:id', protect, notesController.updateNote);
router.delete('/:id', protect, notesController.deleteNote);

module.exports = router;