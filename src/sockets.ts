import { Server, Socket } from 'socket.io';
import Storage from './entities/Storage';
import { IncomingEvents, OutcomingEvents, GameParticipants, SendUnitsDetails, LobbyList, InputUser } from './interfaces';
import { User } from './interfaces/User';

export function handleSocketConnection(io: Server, socket: Socket, storage: Storage) {
  console.log(`${socket.id} connected`);

  socket.on(IncomingEvents.CREATE_NEW_GAME, (user: InputUser, callback: (gameId: string) => void) => {
    const gameId = storage.createNewGame({...user, id: socket.id, isHost: true});
    console.log(`new game created`, gameId)
    console.log(user, callback)
    socket.join(gameId);
    callback(gameId);
  });

  socket.on(IncomingEvents.JOIN_GAME, (user: InputUser, gameId: string, callback: (game: GameParticipants) => void) => {
    const game = storage.getGame(gameId)

    if (game) {
      console.log(`join to game`, game)
      game.joinGame({...user, id: socket.id, isHost: false});

      io.to(gameId).emit(OutcomingEvents.PLAYER_JOINED, socket.id)
      socket.join(gameId);

      callback({ gameId: game.id, players: game.players });
    }
  });

  socket.on(IncomingEvents.START_GAME, (gameId: string) => {
    const game = storage.getGame(gameId)

    if (game) {
      console.log(`start game`, game)
      game.startGame();
      io.to(gameId).emit(OutcomingEvents.GAME_STARTED, game.getGameDetails())
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

  socket.on(IncomingEvents.GET_LOBBY_LIST, (callback: (games: LobbyList[]) => void) => {
    const games = storage.games
    const lobbyList = games.map((game) => ({ id: game.id, usersAmount: game.players.length }))
    callback(lobbyList);
  })
}
