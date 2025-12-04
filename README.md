# Sync Code - Real-Time Collaborative Code Editor

A powerful real-time collaborative code editor built with React, Node.js, Socket.IO, and Monaco Editor. Code together with your team in real-time, just like Google Docs for code!

## 🚀 Features

- **Real-Time Synchronization**: See changes from other users instantly as they type
- **Multiple Users**: Multiple users can edit the same code simultaneously
- **Syntax Highlighting**: Support for multiple programming languages (JavaScript, TypeScript, Python, Java, C++, HTML, CSS, JSON, XML)
- **JWT Authentication**: Secure user authentication with JWT tokens
- **Room System**: Create and join rooms with unique IDs
- **Auto-Save**: Automatic saving of code changes
- **Online Users**: See who's currently in the room
- **Modern UI**: Beautiful, responsive interface built with TailwindCSS
- **Monaco Editor**: Powered by the same editor that runs VS Code

## 🛠️ Tech Stack

### Frontend
- React 18
- Monaco Editor (@monaco-editor/react)
- Socket.IO Client
- React Router DOM
- TailwindCSS
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Real-Time-Collaborative-Code-Editor
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install:all
```

Or manually:

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Server Environment

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/code-editor
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
```

#### Client Environment (Optional)

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod
```

Or use MongoDB Atlas and update the `MONGO_URI` in your `.env` file.

## 🚀 Running the Application

### Development Mode

Run both server and client concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Usage

1. **Sign Up**: Create a new account
2. **Create Room**: Click "Create New Room" to start a new coding session
3. **Share Room ID**: Copy the Room ID and share it with your team
4. **Join Room**: Others can join using the Room ID
5. **Code Together**: Start coding! Changes sync in real-time
6. **Change Language**: Select different programming languages from the dropdown
7. **See Online Users**: View who's currently in the room in the sidebar

## 🏗️ Project Structure

```
Real-Time-Collaborative-Code-Editor/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Login, Signup, Home, Room
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models (User, Room)
│   ├── routes/            # API routes (auth, rooms)
│   ├── socket/            # Socket.IO handlers
│   ├── middleware/        # Auth middleware
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Rooms
- `POST /api/rooms/create` - Create new room (Protected)
- `GET /api/rooms/:roomId` - Get room details (Protected)
- `POST /api/rooms/:roomId/save` - Save room code (Protected)
- `GET /api/rooms/user/rooms` - Get user's rooms (Protected)

## 🔌 Socket.IO Events

### Client → Server
- `join_room` - Join a room
- `code_change` - Send code changes
- `cursor_move` - Send cursor position
- `language_change` - Change language
- `leave_room` - Leave a room

### Server → Client
- `code_update` - Receive code updates
- `users_update` - Receive updated user list
- `cursor_update` - Receive cursor positions
- `language_update` - Receive language changes
- `error` - Error messages

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Build the React app:
```bash
cd client
npm run build
```

2. Deploy the `build` folder to Vercel or Netlify

### Backend (Railway/Render/AWS)

1. Set environment variables on your hosting platform
2. Deploy the `server` folder
3. Make sure MongoDB Atlas is configured

### Environment Variables for Production

- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong secret key
- `CLIENT_URL`: Your frontend URL
- `PORT`: Server port (usually set by hosting platform)

## 🎯 Future Enhancements

- [ ] Cursor position synchronization
- [ ] Video and voice chat integration
- [ ] File upload support
- [ ] Room permissions (read-only, lock room)
- [ ] Code execution
- [ ] Chat feature
- [ ] Theme customization
- [ ] Code formatting
- [ ] Undo/Redo functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for collaborative coding

---

**Happy Coding! 🚀**



