import http from 'http';
import { Server } from 'socket.io';
import express, { Express, Request, Response } from 'express';
import { handleSocketConnection } from './sockets';
import Storage from './entities/Storage';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const storage = new Storage();

setInterval(() => {
  const endedGameIds = storage.updateGames();
  endedGameIds.forEach(({ gameId, winner, loser }) => {
    io.to(winner).emit('WON', gameId);
    io.to(loser).emit('LOST', gameId);
  })
}, 500);


app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => handleSocketConnection(io, socket, storage));

server.listen(3000, () => {
  console.log('listening on *:3000');
});
