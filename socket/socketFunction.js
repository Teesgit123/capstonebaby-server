const knex = require('knex')(require('../knexfile.js'));
const { findOrCreateNewConversation } = require("../controllers/conversationsController.js");

const saveMessageToDatabase = async(sender, receiver, content) => {
  const conversation = await findOrCreateNewConversation(sender, receiver);
  const conversation_id = conversation.id;

  const [newMessage] = await knex("messages")
  .insert({ conversation_id, sender_id: sender, content });


  return newMessage;
};

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

      // save message to database
      await saveMessageToDatabase(sender, receiver, content);

      
      const receiverSocketId = users[receiver];

      if (receiverSocketId) {
        namespace.to(receiverSocketId).emit("receive_message", { sender, content });
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
