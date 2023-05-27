import { IncomingEvents, OutcomingEvents } from '../src/interfaces';
import { io } from 'socket.io-client';

// jest.setTimeout(10000);

// todo: run server
const socket1 = io("http://localhost:3000");
const socket2 = io("http://localhost:3000");

let gameId = '';
let player1 = '';
let player2 = '';

beforeAll((done) => {
  socket1.on('connect', () => {
    socket2.on('connect', done);
  });
});

afterAll(() => {
  socket1.close();
  socket2.close();
});

describe('Socket.IO events', () => {
  it('should create game', (done) => {
    player1 = socket1.id;
    player2 = socket2.id;

    socket1.emit(IncomingEvents.CREATE_NEW_GAME, (inGameId: any) => {
      gameId = inGameId
      expect(typeof gameId).toBe('string');
      expect(gameId.length).toBeGreaterThan(0);

      socket2.emit(IncomingEvents.JOIN_GAME, gameId, (gameParticipants: any) => {
        console.log(gameParticipants)
        expect(gameParticipants).toMatchObject({ gameId, player1, player2 });

        socket1.on(OutcomingEvents.GAME_STARTED, (gameDetails: any) => {
          console.log(gameDetails)
          expect(gameDetails).toMatchObject(
            expect.objectContaining({
              id: gameId,
              player1,
              player2,
              map: expect.objectContaining({
                w: expect.any(Number),
                h: expect.any(Number),
                planetArray: expect.any(Array),
              })
            })
          );
          done();
        });

        socket1.emit(IncomingEvents.START_GAME, gameId);
      });
    });

  });

  // it('should send units', (done) => {
  //   const gameId = 'testGameId';  // You should use a real gameId here
  //   const sourcePlanetId = 1;
  //   const destinationPlanetId = 2;
  //   socket.emit('SEND_UNITS', gameId, sourcePlanetId, destinationPlanetId);
  //   socket.once('SEND_UNITS', (sendUnitsData) => {
  //     expect(sendUnitsData).toHaveProperty('sender', socket.id);
  //     expect(sendUnitsData).toHaveProperty('sourcePlanetId', sourcePlanetId);
  //     expect(sendUnitsData).toHaveProperty('destinationPlanetId', destinationPlanetId);
  //     done();
  //   });
  // });
});
