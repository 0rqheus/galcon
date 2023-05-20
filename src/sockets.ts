import { Server, Socket } from 'socket.io';
import Game from './interfaces/Game';
import Storage from './interfaces/Storage';

export function handleSocketConnection(io: Server, socket: Socket, storage: Storage) {
  console.log(`${socket.id} connected`);

  socket.on('CREATE_NEW_GAME', (callback: (gameId: string) => void) => {
    const gameId = storage.createNewGame(socket.id);

    socket.join(gameId);

    callback(gameId);
  });

  socket.on('JOIN_GAME', (gameId: string, callback: (game: Game) => void) => {
    const game = storage.getGame(gameId)

    if(game && !game.player2) {
      game.player2 = socket.id;

      io.to(gameId).emit('PLAYER_JOINED', socket.id)
      socket.join(gameId);
      callback(game);
    }
  });

  socket.on('START_GAME', (gameId: string) => {
    const game = storage.getGame(gameId)

    if(game) {
      game.isStarted = true;
      io.to(gameId).emit('GAME_STARTED', gameId)
    }
  });

  socket.on('SEND_UNITS', (gameId: string, source: number, destination: number) => {
    const game = storage.getGame(gameId)
    if(game) {
      if (socket.id === game.player1 || socket.id === game.player2) {
        // todo: 
        // if socket.id is owner of source
        // create new timer to send source.planets/2 to destination + calculate timeToReach
        // return {unitsAmount: source.planets/2, timeToReach: x }
      }
    }
  })
}