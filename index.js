const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/userRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const app = express();
const cookies = require("cookie-parser");
const path = require("path");
const socket = require("socket.io");
const compression = require("compression");
require("dotenv").config();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(cookies());

app.use("/api/auth", userRoutes);
app.use("/api/chat", chatRoutes);

const { PORT, MONGO_URI } = process.env;

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static(path.join(__dirname, '../changetalk_frontend/build')));

app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, '../changetalk_frontend/build/index.html'));
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((e) => {
    console.error(e);
  });

const server = app.listen(PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

let room = [];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  socket.on("join_room", (data) => {
    socket.emit("get_id", socket.id);
    socket.join(data);
    room.push(
      {
        id: data,
        user: socket.id
      }
    )
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    room = room.filter((r) => ( r.user !== socket.id ));
  });

  socket.on("caller", (data) => {
    const oopo = room.filter((r) => (r.id === data.roomID && r.user !== data.from));
    io.to(oopo[0].user).emit("caller", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("answer_call", (data) => {
    io.to(data.to).emit("accept_call", data.signal);
  });
});
