import { generateId } from "../utils/utils";
import Game from "../entities/Game";
import { User } from "../interfaces/User";

export default class Storage {
  private readonly _games: Game[];

  constructor() {
    this._games = [] as Game[];
  }

  get games() {
    return this._games;
  }

  /**
   *
   * @returns gameId
   */
  createNewGame(user: User) {
    const gameId = this.createId();
    const game = new Game(gameId, user);

    this._games.push(game);

    return gameId;
  }

  private createId() {
    let notUnique = true;
    let id = "";

    while (notUnique) {
      notUnique = false;
      id = generateId();

      if (this._games.find((g) => g.id === id)) {
        notUnique = true;
      }
    }

    return id;
  }

  getGame(gameId: string) {
    const game = this._games.find((g) => g.id === gameId);
    return game || null;
  }

  private removeGame(gameId: string) {
    return this._games.splice(this._games.findIndex((g) => g.id === gameId), 1);
  }

  /**
   *
   * @returns ids of ended games
   */
  updateGames() {
    const updatedGames = [] as { game: Game; winner: User | null }[];

    for (const game of this._games) {
      if (game.isStarted && !game.isEnded) {
        const winner = game.getWinner();

        if (winner) {
          this.removeGame(game.id);
        } else {
          game.update();
        }

        updatedGames.push({ game, winner });
      }
    }

    return updatedGames;
  }
}
