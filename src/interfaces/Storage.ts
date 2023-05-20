import { generateId } from "../utils/utils";
import Game from './Game';

export default class Storage {
  games: Game[]

  constructor() {
    this.games = [] as Game[]
  }

  /**
   * 
   * @returns gameId
   */
  createNewGame(playerName: string) {
    const gameId = this.createId();
    
    // todo: init game
    const game = {
      id: gameId, 
      player1: playerName, 
      planets: [], 
      intervals: [],
      isEnded: false,
      isStarted: false
    };

    this.games.push(game);

    return gameId;
  }

  private createId() {
    let notUnique = true;
    let id = '';
  
    while(notUnique) {
      id = generateId();
  
      if(this.games.find((g) => g.id === id)) {
        notUnique = false;
      }
    }
  
    return id;
  }
  
  getGame(gameId: string) {
    const game = this.games.find((g) => g.id === gameId);
    return game || null;
  }

  getWinner(gameId: string) {
    const game = this.getGame(gameId);
    let winner = null;
    if(game) {
      // todo: 
      // if all planets have the same user return true
    }
    return winner;
  }

  /**
   * 
   * @returns ids of ended games
   */
  updateGames() {
    const endedGames = [] as {gameId: string, winner: string, loser: string}[];

    for (const game of this.games) {
      if(game.isStarted && !game.isEnded) {
        const winner = this.getWinner(game.id);

        if (winner) {
          game.isEnded = true;
          game.intervals.forEach((intrv) => clearInterval(intrv));
          endedGames.push({
            gameId: game.id, 
            winner, 
            loser: (game.player1 === winner) ? game.player2! : game.player1!
          });
        } else {
          for (const planet of game.planets) {
            // todo:
            // planet.update();
          }
        }
      }
    }

    return endedGames;
  }
}