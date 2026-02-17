const Folder = require('../models/Folder');
const Note = require('../models/Note');

// @desc    Get all folders for current user
// @route   GET /api/folders
// @access  Private
exports.getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new folder
// @route   POST /api/folders
// @access  Private
exports.createFolder = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = await Folder.create({
      userId: req.user._id,
      name,
      color: color || '#3B82F6'
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete folder
// @route   DELETE /api/folders/:id
// @access  Private
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Check if user owns this folder
    if (folder.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Remove folder reference from all notes in this folder
    await Note.updateMany(
      { folderId: req.params.id },
      { $set: { folderId: null } }
    );

    await folder.deleteOne();

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};