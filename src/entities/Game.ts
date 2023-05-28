import { SPEED } from "../config";
import { GameDetails } from "../interfaces";
import { User } from "../interfaces/User";
import { getDistanceBetweenPoints } from "../utils/utils";
import { GameMap } from "./GameMap";
import { Planet } from "./Planet";

export default class Game {
  public readonly id: string;

  private _players: User[] = [];
  private _isStarted: boolean;
  private _isEnded: boolean;

  get players() {
    return this._players;
  }

  get isStarted() {
    return this._isStarted;
  }

  get isEnded() {
    return this._isEnded;
  }

  private intervals: NodeJS.Timer[]

  private map: GameMap;

  constructor(gameId: string, user: User) {
    this.id = gameId;
    this._players.push({ ...user, isHost: true });
    this.intervals = [];
    this.map = new GameMap();
  }

  public getWinner() {
    return this.map.getWinner();
  }

  public generateMap() {
    this.map.generateMap(this._players);
  }

  public startGame() {
    this.generateMap();
    this._isStarted = true;

    return null;
  }

  public joinGame(player: User) {
    this._players.push(player);
  }

  public getPlayerById(userId: string) {
    const targetPlayer = this.players.find((p) => p.id === userId);
    return targetPlayer || null
  }

  public end() {
    this._isEnded = true;
    this.intervals.forEach((intrv) => clearInterval(intrv));
  }

  public update() {
    this.map.updatePlanets();
  }

  public sendFleet(playerId: string, sourcePlanetId: number, destinationPlanetId: number) {
    const source = this.map.getPlanet(sourcePlanetId);
    const destination = this.map.getPlanet(destinationPlanetId);
    const sender = this.getPlayerById(playerId);

    if (!sender) {
      throw new Error('sender does not exist');
    }
    if (!source) {
      throw new Error('no source');
    }
    if (!destination) {
      throw new Error('no destination');
    }
    if (source?.owner?.id !== sender?.id) {
      throw new Error('wrong owner');
    }
    if (source.fleet < 2) {
      throw new Error('no enough to send');
    }

    const unitsAmount = source.sendFleet();
    const timeToReachInSec = this.getTimeToReach(source, destination);

    setTimeout(() => destination.receiveFleet(sender, unitsAmount), timeToReachInSec * 1000);

    return { unitsAmount, timeToReachInSec };
  }

  public getTimeToReach(p1: Planet, p2: Planet): number {
    const dist = getDistanceBetweenPoints(p1.x, p1.y, p2.x, p2.y);
    const timeToReach = dist / SPEED;
    return timeToReach;
  }

  public getGameDetails(): GameDetails {
    return {
      id: this.id,
      players: this.players,
      map: {
        w: this.map.w,
        h: this.map.h,
        planetArray: this.map.planetArray.map((p) => p.getPlanetDetails())
      }
    }
  }
}