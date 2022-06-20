const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/userRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const app = express();
const path = require("path");
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
