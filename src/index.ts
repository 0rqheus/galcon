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
  const updatedGames = storage.updateGames();

  updatedGames.forEach(({ game, winner }) => {
    if(winner) {
      io.to(game.id).emit(OutcomingEvents.GAME_END, winner, game.players);
    } else {
      io.to(game.id).emit(OutcomingEvents.SYNC, game.getGameDetails());
    }
  })
}, 500);


io.on('connection', (socket) => handleSocketConnection(io, socket, storage));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
