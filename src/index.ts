import http from "http";
import { Server } from "socket.io";
import express, { Express, Request, Response } from "express";
import { handleSocketConnection, updateGames } from "./sockets";
import Storage from "./entities/Storage";
import { OutcomingEvents } from "./interfaces";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const storage = new Storage();

setInterval(() => updateGames(io, storage), 500);

io.on("connection", (socket) => handleSocketConnection(io, socket, storage));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
