import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { nanoid } from 'nanoid'

const socket = io("http://localhost:3834")
const userName = nanoid(4)

export default function RoomsChat() {
  const [message, setMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [roomInfo, setRoomInfo] = useState({ userCount: 0 });
  const [availableRooms, setAvailableRooms] = useState([]);

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      socket.emit("join-room", roomName.trim(), userName);
      setRoomName('');
    }
  };

  const leaveRoom = () => {
    if (currentRoom) {
      socket.emit("leave-room", currentRoom, userName);
      setCurrentRoom('');
      setChat([]);
      setRoomInfo({ userCount: 0 });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && currentRoom) {
      socket.emit("room-chat", {
        roomName: currentRoom,
        message: message.trim(),
        userName
      });
      setMessage('');
    }
  };

  const getRoomsList = () => {
    socket.emit("get-rooms");
  };

  const joinExistingRoom = (room) => {
    socket.emit("join-room", room.name, userName);
  };

  useEffect(() => {
    const onConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const onRoomJoined = (data) => {
      console.log("Joined room:", data);
      setCurrentRoom(data.roomName);
      setChat(prev => [...prev, {
        type: 'system',
        message: data.message,
        timestamp: new Date()
      }]);
    };

    const onUserJoined = (data) => {
      console.log("data from server:", data)
      setChat(prev => [...prev, {
        type: 'system',
        message: data.message,
        timestamp: data.timestamp
      }]);
    };

    const onUserLeft = (data) => {
      setChat(prev => [...prev, {
        type: 'system',
        message: data.message,
        timestamp: data.timestamp
      }]);
    };

    const onRoomChat = (data) => {
      setChat(prev => [...prev, {
        type: 'chat',
        userName: data.userName,
        message: data.message,
        timestamp: data.timestamp,
        isOwn: data.socketId === socket.id
      }]);
    };

    const onRoomInfo = (data) => {
      setRoomInfo(data);
    };

    const onRoomsList = (rooms) => {
      setAvailableRooms(rooms);
    };

    // Set up event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room-joined", onRoomJoined);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("room-chat", onRoomChat);
    socket.on("room-info", onRoomInfo);
    socket.on("rooms-list", onRoomsList);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room-joined", onRoomJoined);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("room-chat", onRoomChat);
      socket.off("room-info", onRoomInfo);
      socket.off("rooms-list", onRoomsList);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Rooms Chat App</h1>
        
        {/* User Info */}
        <div className="bg-blue-100 p-4 rounded-lg mb-6">
          <p><strong>Your Username:</strong> {userName}</p>
          <p><strong>Connection:</strong> {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
          <p><strong>Current Room:</strong> {currentRoom || "None"}</p>
          {currentRoom && <p><strong>Users in Room:</strong> {roomInfo.userCount}</p>}
        </div>

        {/* Room Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Join Room */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Join Room</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full p-2 border border-gray-300 rounded"
                onKeyPress={(e) => e.key === 'Enter' && joinRoom(e)}
              />
              <button
                onClick={joinRoom}
                disabled={!isConnected || !roomName.trim()}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Join Room
              </button>
            </div>
            
            {currentRoom && (
              <button
                onClick={leaveRoom}
                className="w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Leave Current Room
              </button>
            )}
          </div>

          {/* Available Rooms */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Available Rooms</h3>
              <button
                onClick={getRoomsList}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Refresh
              </button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableRooms.length === 0 ? (
                <p className="text-gray-500 text-sm">No rooms available</p>
              ) : (
                availableRooms.map((room, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                    <span className="text-sm">
                      <strong>{room.name}</strong> ({room.userCount} users)
                    </span>
                    <button
                      onClick={() => joinExistingRoom(room)}
                      disabled={currentRoom === room.name}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {currentRoom === room.name ? "Current" : "Join"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        {currentRoom && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Room: {currentRoom}</h3>
            
            {/* Messages */}
            <div className="bg-white border rounded-lg h-64 overflow-y-auto p-4 mb-4">
              {chat.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet...</p>
              ) : (
                chat.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.type === 'system' ? 'text-center text-gray-500 italic' : ''}`}>
                    {msg.type === 'system' ? (
                      <span className="text-sm">{msg.message}</span>
                    ) : (
                      <div className={`${msg.isOwn ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg max-w-xs ${
                          msg.isOwn 
                            ? 'bg-blue-500 text-white ml-auto' 
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          <div className="text-xs font-semibold mb-1">
                            {msg.isOwn ? 'You' : msg.userName}
                          </div>
                          {msg.message}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}