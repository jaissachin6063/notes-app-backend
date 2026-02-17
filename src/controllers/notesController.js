const Note = require('../models/Note');

// @desc    Get all notes for current user
// @route   GET /api/notes
// @access  Private
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .sort({ updatedAt: -1 }); // Most recent first
    
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns this note
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res) => {
  try {
    const { title, content, folderId, tags } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.create({
      userId: req.user._id,
      title,
      content,
      folderId: folderId || null,
      tags: tags || []
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    const { title, content, folderId, tags } = req.body;

    let note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns this note
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    note.title = title || note.title;
    note.content = content || note.content;
    note.folderId = folderId !== undefined ? folderId : note.folderId;
    note.tags = tags || note.tags;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns this note
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search notes
// @route   GET /api/notes/search?q=query
// @access  Private
exports.searchNotes = async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const notes = await Note.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};