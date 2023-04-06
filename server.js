const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const signupRoute = require("./routes/signupRoute.js");
const {
  router: messagesRouter,
  messageIo,
} = require("./routes/messagesRoute.js");

const { CORS_ORIGIN } = process.env;
const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

app.use("/", signupRoute);
app.use("/messages", messagesRouter);

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
});

messageIo.attach(server);

server.listen(port, () => {
  console.log(`We are listening on ${port}`);
});
