const users = {};

const initSocketIo = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log(users);
    });

    socket.on("send_message", (data) => {
      const { sender, receiver, content } = data;

      // Save the message to the database here, before emitting it.
      // For example:
      // await saveMessageToDatabase(sender, receiver, content);

      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", { sender, content });
      } else {
        console.log("Receiver not found");
      }
    });
  });
};

module.exports = initSocketIo;
