const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "*"
    }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    io.emit("no", "Thi is the message");
    // Broadcast to all clients
  });

  socket.emit("good","good-message")

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
