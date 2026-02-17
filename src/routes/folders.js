const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const foldersController = require('../controllers/foldersController');

router.get('/', protect, foldersController.getAllFolders);
router.post('/', protect, foldersController.createFolder);
router.delete('/:id', protect, foldersController.deleteFolder);

module.exports = router;