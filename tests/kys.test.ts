import { IncomingEvents, OutcomingEvents } from '../src/interfaces';
import { io } from 'socket.io-client';

// jest.setTimeout(10000);

// todo: run server
const socket1 = io("http://localhost:3000");
const socket2 = io("http://localhost:3000");

let gameId = '';
let player1Id = '';
let player2Id = '';

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
    player1Id = socket1.id;
    player2Id = socket2.id;

    const user1 = { name: 'killme132', color: 'green' };
    const user2 = { name: 'ihatemylife771', color: 'orange' };

    socket1.emit(IncomingEvents.CREATE_NEW_GAME, user1, (inGameId: any) => {
      gameId = inGameId
      expect(typeof gameId).toBe('string');
      expect(gameId.length).toBeGreaterThan(0);

      socket2.emit(IncomingEvents.JOIN_GAME, user2, inGameId, (gameParticipants: any) => {
        console.log(gameParticipants)
        console.log('wft???')
        expect(gameParticipants).toMatchObject(expect.objectContaining({
          gameId: gameId,
          players: expect.arrayContaining([
            expect.objectContaining(user1),
            expect.objectContaining(user2)
          ]),
        }));

        socket1.on(OutcomingEvents.GAME_STARTED, (gameDetails: any) => {
          console.log(gameDetails)
          expect(gameDetails).toMatchObject(
            expect.objectContaining({
              id: gameId,
              players: expect.arrayContaining([
                expect.objectContaining(user1),
                expect.objectContaining(user2)
              ]),
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
