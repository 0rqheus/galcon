import { Server, Socket } from "socket.io";
import Storage from "./entities/Storage";
import {
  IncomingEvents,
  OutcomingEvents,
  GameParticipants,
  SendUnitsDetails,
  LobbyList,
  InputUser,
} from "./interfaces";

export const updateGames = (io: Server, storage: Storage) => {
  const updatedGames = storage.updateGames();

  updatedGames.forEach(({ game, winner }) => {
    if (winner) {
      io.to(game.id).emit(OutcomingEvents.GAME_END, winner, game.players);
      io.socketsLeave(game.id);
    } else {
      io.to(game.id).emit(OutcomingEvents.SYNC, game.getGameDetails());
    }
  });
}

export const handleSocketConnection = (io: Server, socket: Socket, storage: Storage) => {
  console.log(`${socket.id} connected`);
  socket.join("players");

  socket.on(
    IncomingEvents.CREATE_NEW_GAME,
    (user: InputUser, callback: (gameId: string) => void) => {
      const gameId = storage.createNewGame({
        ...user,
        id: socket.id,
        isHost: true,
      });
      console.log(`new game created`, gameId);
      console.log(user, callback);
      socket.join(gameId);
      io.to("players").emit(OutcomingEvents.GAME_CREATED);
      callback(gameId);
    }
  );

  socket.on(
    IncomingEvents.JOIN_GAME,
    (
      user: InputUser,
      gameId: string,
      callback: (game: GameParticipants) => void
    ) => {
      const game = storage.getGame(gameId);

      if (game) {
        console.log(`join to game`, game)
        const convertedUser = { ...user, id: socket.id, isHost: false };
        game.joinGame(convertedUser);

        io.to(gameId).emit(OutcomingEvents.PLAYER_JOINED, convertedUser)
        socket.join(gameId);

        callback({ gameId: game.id, players: game.players });
      }
    }
  );

  socket.on(IncomingEvents.START_GAME, (gameId: string) => {
    const game = storage.getGame(gameId);

    if (game) {
      console.log(`start game`, game);
      game.startGame();
      io.to(gameId).emit(OutcomingEvents.GAME_STARTED, game.getGameDetails());
    }
  });

  socket.on(
    IncomingEvents.SEND_UNITS,
    (gameId: string, sourcePlanetId: number, destinationPlanetId: number) => {
      const game = storage.getGame(gameId);

      if (game) {
        try {
          const { unitsAmount, timeToReachInSec } = game.sendFleet(
            socket.id,
            sourcePlanetId,
            destinationPlanetId
          );

          const sendUnitsData: SendUnitsDetails = {
            sender: socket.id,
            unitsAmount,
            timeToReachInSec,
            sourcePlanetId,
            destinationPlanetId,
          };
          io.to(gameId).emit(OutcomingEvents.SEND_UNITS, sendUnitsData);
        } catch (err) {
          console.log(err);
        }
      }
    }
  );

  socket.on(
    IncomingEvents.GET_LOBBY_LIST,
    (callback: (games: LobbyList[]) => void) => {
      const games = storage.games;
      const lobbyList = games.map((game) => ({
        id: game.id,
        usersAmount: game.players.length,
        isStarted: game.isStarted
      }));
      callback(lobbyList);
    }
  );
}
