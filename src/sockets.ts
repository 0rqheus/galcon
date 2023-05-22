import { Server, Socket } from 'socket.io';
import Storage from './entities/Storage';
import {IncomingEvents, OutcomingEvents, GameDetails, SendUnitsDetails} from './interfaces';

export function handleSocketConnection(io: Server, socket: Socket, storage: Storage) {
  console.log(`${socket.id} connected`);

  socket.on(IncomingEvents.CREATE_NEW_GAME, (callback: (gameId: string) => void) => {
    const gameId = storage.createNewGame(socket.id);
    socket.join(gameId);
    callback(gameId);
  });

  socket.on(IncomingEvents.JOIN_GAME, (gameId: string, callback: (game: GameDetails) => void) => {
    const game = storage.getGame(gameId)

    if (game) {
      game.joinGame(socket.id);

      io.to(gameId).emit(OutcomingEvents.PLAYER_JOINED, socket.id)
      socket.join(gameId);

      callback({ gameId: game.id, player1: game.player1, player2: game.player2 });
    }
  });

  socket.on(IncomingEvents.START_GAME, (gameId: string) => {
    const game = storage.getGame(gameId)

    if (game) {
      game.startGame();
      io.to(gameId).emit(OutcomingEvents.GAME_STARTED)
    }
  });

  socket.on(IncomingEvents.SEND_UNITS, (gameId: string, sourcePlanetId: number, destinationPlanetId: number) => {
    const game = storage.getGame(gameId)

    if (game) {
      try {
        const { unitsAmount, timeToReachInSec } = game.sendFleet(socket.id, sourcePlanetId, destinationPlanetId);

        const sendUnitsData: SendUnitsDetails = {
          sender: socket.id,
          unitsAmount,
          timeToReachInSec,
          sourcePlanetId,
          destinationPlanetId
        }
        io.to(gameId).emit(OutcomingEvents.SEND_UNITS, sendUnitsData)
      } catch (err) {
        console.log(err);
      }
    }
  })
}
