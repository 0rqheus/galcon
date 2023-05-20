import { generateId } from "../utils/utils";
import Game from '../entities/Game';

export default class Storage {
  private readonly games: Game[]

  constructor() {
    this.games = [] as Game[]
  }

  /**
   * 
   * @returns gameId
   */
  createNewGame(playerName: string) {
    const gameId = this.createId();
    const game = new Game(gameId, playerName);

    this.games.push(game);

    return gameId;
  }

  private createId() {
    let notUnique = true;
    let id = '';

    while (notUnique) {
      id = generateId();

      if (this.games.find((g) => g.id === id)) {
        notUnique = false;
      }
    }

    return id;
  }

  getGame(gameId: string) {
    const game = this.games.find((g) => g.id === gameId);
    return game || null;
  }

  /**
   * 
   * @returns ids of ended games
   */
  updateGames() {
    const endedGames = [] as { gameId: string, winner: string, loser: string }[];

    for (const game of this.games) {
      if (game.isStarted && !game.isEnded) {
        const winner = game.getWinner();

        if (winner) {
          game.end();

          endedGames.push({
            gameId: game.id,
            winner,
            loser: (game.player1 === winner) ? game.player2! : game.player1!
          });
        } else {
          game.update();
        }
      }
    }

    return endedGames;
  }
}