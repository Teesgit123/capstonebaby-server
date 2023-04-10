const knex = require("knex")(require("../knexfile.js"));
const jwt = require("jsonwebtoken");


const startSocket = (namespace) => {
  const users = {};

  namespace.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if(!token) {
      return next(new Error("There was an error with authenticating who you are."));
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

    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });
  })
}


module.exports = startSocket;
