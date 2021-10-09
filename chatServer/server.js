const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const http = require("http");
const wrap = require("./utils/wrapping.js");
const botName = "Admin Bot";
const {
  createUser,
  currentUser,
  disconnectUser,
  getRoomUsers,
} = require("./utils/users.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = createUser(socket.id, username, room);

    socket.join(room);

    socket.emit("message", wrap(botName, "Ky!!"));
    socket.broadcast
      .to(room)
      .emit("message", wrap(botName, `${username} was connected`));

    io.to(room).emit('refreshChat', {
        users: getRoomUsers(room),
        room
    });
  });

  socket.on("chatMessage", (message) => {
    const user = currentUser(socket.id);

    io.to(user.room).emit("message", wrap(user.username, message));
  });

  socket.on("disconnect", () => {
    const user = disconnectUser(socket.id);

    if (user)
      io.to(user.room).emit(
        "message",
        wrap(botName, `${user.username} has disconnected`)
      );

    io.to(user.room).emit('refreshChat', {
        user: getRoomUsers(user.room),
        room: user.room
    });
  });
});

//server.listen(3000, () => console.log("Server started"));
module.exports = server;