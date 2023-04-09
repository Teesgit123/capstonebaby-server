const knex = require("knex")(require("../knexfile.js"));
const {
  saveMessageToDatabase,
} = require("../controllers/messagesController.js");

const initSocketIo = (namespace) => {
  const users = {};

  namespace.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log(users);
    });

    socket.on("send_message", async (data) => {
      const { sender, receiver, content } = data;

      // Save message to the database
      const conversationId = await saveMessageToDatabase(
        sender,
        receiver,
        content
      );

      const receiverSocketId = users[receiver];

      if (receiverSocketId) {
        namespace
          .to(receiverSocketId)
          .emit("receive_message", { sender, content, conversationId });
      } else {
        console.log("Receiver not found");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });
  });
};

module.exports = initSocketIo;
