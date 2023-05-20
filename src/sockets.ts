import { Server, Socket } from 'socket.io';
import Game from './entities/Game';
import Storage from './entities/Storage';

export function handleSocketConnection(io: Server, socket: Socket, storage: Storage) {
  console.log(`${socket.id} connected`);

  socket.on('CREATE_NEW_GAME', (callback: (gameId: string) => void) => {
    const gameId = storage.createNewGame(socket.id);
    socket.join(gameId);
    callback(gameId);
  });

  socket.on('JOIN_GAME', (gameId: string, callback: (game: Game) => void) => {
    const game = storage.getGame(gameId)

    if (game) {
      game.joinGame(socket.id);

      io.to(gameId).emit('PLAYER_JOINED', socket.id)
      socket.join(gameId);
      callback(game);
    }
  });

  socket.on('START_GAME', (gameId: string) => {
    const game = storage.getGame(gameId)
    if (game) {
      game.startGame();
      io.to(gameId).emit('GAME_STARTED', game)
    }
  });

  socket.on('SEND_UNITS', (gameId: string, source: number, destination: number) => {
    const game = storage.getGame(gameId)
    if (game) {

      try {
        const { unitsAmount, timeToReach } = game.sendFleet(socket.id, source, destination);

        const sendUnitsData = {
          unitsAmount,
          timeToReach,
          sender: socket.id,
          source,
          destination
        }

        io.to(gameId).emit('SEND_UNITS', sendUnitsData)
      } catch (err) {
        console.log(err);
      }
    }
  })
}