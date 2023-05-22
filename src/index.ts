import http from 'http';
import { Server } from 'socket.io';
import express, { Express, Request, Response } from 'express';
import { handleSocketConnection } from './sockets';
import Storage from './entities/Storage';
import { OutcomingEvents } from './interfaces';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const storage = new Storage();

setInterval(() => {
  const endedGameIds = storage.updateGames();
  endedGameIds.forEach(({ gameId, winner, loser }) => {
    io.to(winner).emit(OutcomingEvents.WON, gameId);
    io.to(loser).emit(OutcomingEvents.LOST, gameId);
  })
}, 500);


io.on('connection', (socket) => handleSocketConnection(io, socket, storage));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
