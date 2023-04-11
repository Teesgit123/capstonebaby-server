const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const signupRoute = require("./routes/signupRoute.js");
const loginRoute = require("./routes/loginRoute.js");
const messagesRouter = require("./routes/messagesRoute.js");
const conversationsRouter = require("./routes/conversationsRoute.js");
const usersRoute = require('./routes/usersRoute.js')
const startSocket = require("./socket/socketFunction.js");

const { CORS_ORIGIN } = process.env;
const port = process.env.PORT || 8080;

const app = express();
const server = require("http").Server(app);
const io = new socketio.Server(server, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

app.use("/", loginRoute);
app.use("/signup", signupRoute); // Signup route attached to the /signup endpoint
app.use("/users", usersRoute);
app.use("/messages", messagesRouter);
app.use("/conversations", conversationsRouter);

const messagesNamespace = io.of("/messages");
startSocket(messagesNamespace);

server.listen(port, () => {
  console.log(`We are listening on ${port}`);
});
