// messagesRoute.js

const express = require("express");
const router = express.Router();
const { Server } = require("socket.io");
const cors = require("cors");

router.use(cors());

const messageIo = new Server({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

messageIo.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

router.get("/", (req, res) => {
  res.send("Messages Route is this one");
});

module.exports = {
  router,
  messageIo,
};
