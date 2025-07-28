import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { nanoid } from 'nanoid'
import './index.css'

const socket = io("http://localhost:3834")
const userName = nanoid(4)

export default function Chatty() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const sendChat = (e) => {
    e.preventDefault()
    console.log("Sending message:", message)
    socket.to("some room").emit("chat", { message, userName })
    setMessage('');
  }

  useEffect(() => {
    // Connection event handlers
    const onConnect = () => {
      console.log("Socket connected")
      setIsConnected(true)
    }

    const onDisconnect = () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    }

    // Chat message handler
    const handleChat = (payload) => {
      console.log("Received chat message:", payload)
      setChat(prevChat => [...prevChat, payload])
    }

    // Set up event listeners
    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("chat", handleChat)

    // Check if already connected
    if (socket.connected) {
      setIsConnected(true)
    }

    // Cleanup function
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("chat", handleChat)
    }
  }, [])

  return (
    <div className='App'>
      <header>
        <h1>Chatty app</h1>
        <p>Connection status: {isConnected ? "Connected" : "Disconnected"}</p>
        <p>Messages: {chat.length}</p>
        
        <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
          {chat.map((payload, index) => {
            return(
              <p key={index}>{payload.message}: <span>id: {payload.userName}</span></p>
            )
          })}
        </div>
        
        <form onSubmit={sendChat}>
          <input 
            className='' 
            type='text' 
            name='chat' 
            placeholder='send text' 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit' disabled={!isConnected}>
            {isConnected ? 'Send' : 'Connecting...'}
          </button>
        </form>
      </header>
    </div>
  )
}