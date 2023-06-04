import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import { port } from "./conf.js";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});
const PORT = port;

app.use(cors());
app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log(socket.id);
  var line_history = [];
  socket.on("message", (message) => {
    console.log(message);
    socket.broadcast.emit("message", {
      body: message,
      from: socket.id,
    });
  });

  socket.on("drawLine", (data) => {
    line_history.push(data.line);
    io.emit("drawLine", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    // Manejar la desconexión del cliente
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT);
console.log("Server started on port ", PORT);
