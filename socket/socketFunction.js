const knex = require("knex")(require("../knexfile.js"));
const jwt = require("jsonwebtoken");

const getConversationHistory = async (userId, conversationId) => {
  try {
    // get the messages table filtering by userId and conversationId
    const messages = await knex("messages")
      .select("messages.sender_id as sender", "messages.receiver_id as receiver", "messages.content", "users.name as sender_name")
      .join("users", "users.id", "=", "messages.sender_id")
      .where(function () {
        this.where("messages.sender_id", userId).andWhere(
          "messages.conversation_id",
          conversationId
        );
      })
      .orWhere(function () {
        this.where("messages.receiver_id", userId).andWhere(
          "messages.conversation_id",
          conversationId
        );
      })
      .orderBy("messages.created_at", "asc");
    

    return messages;
  } catch (error) {
    console.log(
      "this error comes from the getConversationHistory function inside the testingController.js file: ",
      error
    );
    return [];
  }
};






const startSocket = (namespace) => {
  const users = {};
  namespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(!token) {
      return next(new Error("There was an error with authenticating who you are, ie no token present."));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.userId = decoded.id;
      next();
    }
    
    catch (error) {
      next(new Error("Your token was received, but it is invalid."));
    }
  });

  namespace.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("register", (userId) => {
        users[userId] = socket.id;
        console.log(users);
    });

    socket.on("send_message", async (data) => {
        const { sender, receiver, content } = data;
        // Save message to the database
        const receiverSocketId = users[receiver];
        if (receiverSocketId) {
          namespace
            .to(receiverSocketId)
            .emit("receive_message", {
              sender,
              receiver,
              content,
              });
        } 
        else {
          console.log("Receiver not found");
        }
    });

    // event listener for getting conversation history

    socket.on("get_conversation_history", async ({ userId, conversationId }) => {
      try {
        // get conversation history from the databadse, using the userId and conversation Id
        const messages = await getConversationHistory(userId, conversationId);

        // emit the conversation_history event with the messages we just fetched

        socket.emit("conversation_history", messages);

      }
      catch (error) {
        console.log("Error getting the conversation history (this if from SocketFunction.js): ", error);
      }





    })

    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });
  })
}


module.exports = startSocket;
