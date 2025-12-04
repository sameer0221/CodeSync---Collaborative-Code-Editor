const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');

// Store active users in each room
const roomUsers = new Map();

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const initializeSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      socket.userName = user.name;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userName} (${socket.id})`);

    // Join room
    socket.on('join_room', async (data) => {
      const { roomId } = data;
      
      try {
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        socket.join(roomId);
        
        // Add user to room users map
        if (!roomUsers.has(roomId)) {
          roomUsers.set(roomId, new Map());
        }
        roomUsers.get(roomId).set(socket.id, {
          userId: socket.userId,
          userName: socket.userName,
          socketId: socket.id
        });

        // Send current code to the new user
        socket.emit('code_update', {
          code: room.code,
          language: room.language
        });

        // Broadcast updated user list
        const users = Array.from(roomUsers.get(roomId).values());
        io.to(roomId).emit('users_update', users);

        console.log(`👤 ${socket.userName} joined room: ${roomId}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle code changes with debouncing
    const debouncedCodeChange = debounce(async (data) => {
      const { roomId, code, language } = data;
      
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        if (room.isReadOnly && room.createdBy.toString() !== socket.userId) {
          socket.emit('error', { message: 'Room is read-only' });
          return;
        }

        // Update room in database
        room.code = code;
        if (language) room.language = language;
        await room.save();

        // Broadcast to other users in the room
        socket.to(roomId).emit('code_update', {
          code,
          language: language || room.language
        });
      } catch (error) {
        console.error('Code change error:', error);
      }
    }, 300); // 300ms debounce

    socket.on('code_change', (data) => {
      debouncedCodeChange(data);
    });

    // Handle cursor position updates
    socket.on('cursor_move', (data) => {
      const { roomId, cursorPos } = data;
      socket.to(roomId).emit('cursor_update', {
        userId: socket.userId,
        userName: socket.userName,
        cursorPos
      });
    });

    // Handle language change
    socket.on('language_change', async (data) => {
      const { roomId, language } = data;
      
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        room.language = language;
        await room.save();

        io.to(roomId).emit('language_update', language);
      } catch (error) {
        console.error('Language change error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userName} (${socket.id})`);
      
      // Remove user from all rooms
      roomUsers.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          
          // Broadcast updated user list
          const updatedUsers = Array.from(users.values());
          io.to(roomId).emit('users_update', updatedUsers);
        }
      });
    });

    // Leave room
    socket.on('leave_room', (data) => {
      const { roomId } = data;
      socket.leave(roomId);
      
      if (roomUsers.has(roomId)) {
        roomUsers.get(roomId).delete(socket.id);
        const updatedUsers = Array.from(roomUsers.get(roomId).values());
        io.to(roomId).emit('users_update', updatedUsers);
      }
    });
  });
};

module.exports = { initializeSocket };



