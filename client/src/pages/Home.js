import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const createRoom = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/rooms/create`);
      const { room } = response.data;
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      toast.error('Failed to create room');
      setLoading(false);
    }
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    navigate(`/room/${roomId.trim()}`);
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Sync Code</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Collaborative Code Editor
            </h2>
            <p className="text-gray-600">
              Code together in real-time with your team
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={createRoom}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Creating Room...' : 'Create New Room'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Join Existing Room
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
                />
                <button
                  onClick={joinRoom}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
                >
                  Join
                </button>
              </div>
              {roomId && (
                <button
                  onClick={handleCopyRoomId}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  📋 Copy Room ID
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Real-time code synchronization</li>
              <li>✅ Multiple users can edit simultaneously</li>
              <li>✅ Syntax highlighting for multiple languages</li>
              <li>✅ Auto-save functionality</li>
              <li>✅ See who's online in the room</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

