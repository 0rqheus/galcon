import http from 'http';
import { Server } from 'socket.io';
import express, { Express, Request, Response } from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});