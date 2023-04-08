const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const signupRoute = require("./routes/signupRoute.js");
const loginRoute = require("./routes/loginRoute.js");
const messagesRouter = require("./routes/messagesRoute.js");
const initSocketIo = require("./socket/socketFunction.js");

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
app.use("/messages", messagesRouter);

initSocketIo(io);

server.listen(port, () => {
  console.log(`We are listening on ${port}`);
});
