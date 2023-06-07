# Galcon backend

## Description
Backend server for galcon 2 game. It uses socket.io library to provide real-time communication with client.

## API
### Incoming events
- __Event__: `CREATE_NEW_GAME`

  __Parameters__:
  * user: `InputUser` - user data with name and color
  * callback: `(gameId: string) => void` — a callback function that returns gameId.
  
  __Description__: Creates new game, subscribes client socket to the game room and invokes the provided 
  callback function with the generated gameId.

- __Event__: `JOIN_GAME`

  __Parameters__:
  * user: `InputUser` - user data with name and color
  * gameId: `string` — the Id of the game
  * callback: `(game: GameParticipants) => void` — a callback function that returns game participants.
  
  __Description__: Subscribes client socket to the game room, emits `PLAYER_JOINED` event to the game room 
  and invokes the provided callback function with game participants.

- __Event__: `START_GAME`

  __Parameters__:
  * gameId: `string` — the Id of the game
  
  __Description__: Sets that game is started and and emits `GAME_STARTED` event to the game room.

- __Event__: `SEND_UNITS`

  __Parameters__:
  * gameId: `string` — the Id of the game
  * sourcePlanetId: `number` — the Id of the source planet
  * destinationPlanetId: `number` — the Id of the destination planet
  
  __Description__: Takes a half of the ships from the source planet, starts timer to add them to destination 
  planet after calculated time and emits `SEND_UNITS` event to the game room.

- __Event__: `GET_LOBBY_LIST`

  __Parameters__:
  * callback: `(lobbyList: LobbyList[]) => void` — a callback function that returns info about lobbies.


### Outcoming events

- __Event__: `PLAYER_JOINED`

  __Parameters__:
  * player: `User` — user data with name, color and id
  
  __Description__: Emits the event to all players when new player is joined.

- __Event__: `GAME_STARTED`

  __Parameters__:
  * details: `GameDetails` — the game details
  
  __Description__: Emits the event with game detail to all players when host starts the game.

- __Event__: `SEND_UNITS`

  __Parameters__:
  * details: `SendUnitsDetails` — the details of this action
  
  __Description__: Emits the event to all players when players sends units.

- __Event__: `GAME_END`

  __Parameters__:
  * winner: `User` — winner of the game
  * players: `User[]` — all participants
  
  __Description__: Emits the event to all players at the end of the game.

- __Event__: `SYNC`

  __Parameters__:
  * detals: `GameDetails` — the game details

  __Description__: Emits the event to all players once in a while to sync data.