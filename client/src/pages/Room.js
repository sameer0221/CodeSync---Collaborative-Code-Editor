import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const isLocalChange = useRef(false);
  const saveTimeoutRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' }
  ];

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      // Join room
      socketRef.current.emit('join_room', { roomId });
    });

    socketRef.current.on('code_update', (data) => {
      if (!isLocalChange.current && editorRef.current) {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== data.code) {
          editorRef.current.setValue(data.code);
          setCode(data.code);
        }
        if (data.language && data.language !== language) {
          setLanguage(data.language);
        }
      }
      isLocalChange.current = false;
    });

    socketRef.current.on('users_update', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socketRef.current.on('language_update', (newLanguage) => {
      setLanguage(newLanguage);
    });

    socketRef.current.on('error', (error) => {
      toast.error(error.message || 'An error occurred');
    });

    // Load room data
    loadRoomData();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_room', { roomId });
        socketRef.current.disconnect();
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [roomId, token]);

  const loadRoomData = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms/${roomId}`);
      const { room } = response.data;
      setCode(room.code || '');
      setLanguage(room.language || 'javascript');
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load room');
      navigate('/');
    }
  };

  const handleEditorChange = (value) => {
    isLocalChange.current = true;
    setCode(value || '');

    // Emit code change to server
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('code_change', {
        roomId,
        code: value || '',
        language
      });
    }

    // Auto-save after 2 seconds of inactivity
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveRoom();
    }, 2000);
  };

  const saveRoom = async () => {
    try {
      await axios.post(`${API_URL}/rooms/${roomId}/save`, {
        code,
        language
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('language_change', {
        roomId,
        language: newLanguage
      });
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard!');
  };

  const handleLeaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave_room', { roomId });
      socketRef.current.disconnect();
    }
    navigate('/');
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading room...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">CodeSync</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Room ID:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                  {roomId}
                </code>
                <button
                  onClick={handleCopyRoomId}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Language:</label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {users.length} {users.length === 1 ? 'user' : 'users'} online
                </span>
              </div>

              <button
                onClick={handleLeaveRoom}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              formatOnPaste: true,
              formatOnType: true
            }}
          />
        </div>

        {/* Sidebar - Online Users */}
        <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Online Users ({users.length})
          </h2>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500">No other users online</p>
            ) : (
              users.map((user, index) => (
                <div
                  key={user.socketId || index}
                  className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.userName}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;

