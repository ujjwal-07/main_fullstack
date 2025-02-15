import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002"); // Replace with your backend server URL

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
 
  useEffect(() => {
    // Listen for messages from the server
    socket.on("no", (msg) => {
      console.log(msg, "This is the msg")
      setMessages((prev) => [...prev, msg]); // Append new messages to the list
    });


    return () => {
      socket.disconnect(); // Clean up the connection
    };
  }, []);

  const sendMessage = () => {

    socket.on("good",(msg)=>{
      console.log(msg)
    })
    console.log(input.trim())
    if (input.trim()) {
      socket.emit("message", input); // Send message to the server
      setInput(""); // Clear input field
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Socket.IO Chat</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: 0 }}>
            {msg} this is the message
          </p>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{
            padding: "8px",
            marginRight: "5px",
            width: "70%",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 15px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
