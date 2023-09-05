const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");

const dbConnection = require("./config/database");

require("dotenv").config();
const server = http.createServer(app);
const io = socketIO(server);

dbConnection();
app.use(express.json());

io.on("connection", (socket) => {
  console.log("A user connected.");
  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });
});

app.use("/api/auth", require("./routers/auth.router"));
app.use("/api/user", require("./routers/user.router"));
app.use("/api/messages", require("./routers/message.router"));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
