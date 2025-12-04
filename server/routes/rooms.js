const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Room
router.post('/create', auth, async (req, res) => {
  try {
    const roomId = uuidv4();
    const room = new Room({
      roomId,
      createdBy: req.user._id,
      code: '',
      language: 'javascript'
    });

    await room.save();

    res.status(201).json({
      message: 'Room created successfully',
      room: {
        roomId: room.roomId,
        createdAt: room.createdAt,
        roomURL: `${process.env.CLIENT_URL || 'http://localhost:3000'}/room/${room.roomId}`
      }
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Room
router.get('/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId }).populate('createdBy', 'name email');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      room: {
        roomId: room.roomId,
        code: room.code,
        language: room.language,
        createdBy: room.createdBy,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        isLocked: room.isLocked,
        isReadOnly: room.isReadOnly
      }
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save Room Code
router.post('/:roomId/save', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code, language } = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.isReadOnly && room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Room is read-only' });
    }

    room.code = code || room.code;
    if (language) room.language = language;
    await room.save();

    res.json({ message: 'Room saved successfully', updatedAt: room.updatedAt });
  } catch (error) {
    console.error('Save room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User's Rooms
router.get('/user/rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ createdBy: req.user._id })
      .sort({ updatedAt: -1 })
      .select('roomId code language createdAt updatedAt');

    res.json({ rooms });
  } catch (error) {
    console.error('Get user rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



