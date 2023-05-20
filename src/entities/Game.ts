import { SPEED } from "../config";
import { getDistanceBetweenPoints } from "../utils/utils";
import { GameMap } from "./GameMap";
import { Planet } from "./Planet";

export default class Game {
  public readonly id: string;

  private _player1: string;
  private _player2: string;
  private _isStarted: boolean;
  private _isEnded: boolean;

  get player1() {
    return this._player1;
  }

  get player2() {
    return this._player2;
  }

  get isStarted() {
    return this._isStarted;
  }

  get isEnded() {
    return this._isEnded;
  }

  private intervals: NodeJS.Timer[]

  private map: GameMap;

  constructor(gameId: string, owner: string) {
    this.id = gameId;
    this._player1 = owner;
    this.intervals = [];
    this.map = new GameMap();
  }

  public getWinner() {
    return this.map.getWinner();
  }

  public generateMap() {
    this.map.generateMap([this.player1, this.player2]);
  }

  public startGame() {
    this.generateMap();
    this._isStarted = true;

    return null;
  }

  public joinGame(playerId: string) {
    this._player2 = playerId;
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

    if (!source) {
      throw new Error('no source');
    }
    if (!destination) {
      throw new Error('no destination');
    }
    if (source?.ownerID === playerId) {
      throw new Error('wrong owner');
    }
    if (source.fleet < 2) {
      throw new Error('no enough to send');
    }

    const unitsAmount = source.sendFleet();
    const timeToReach = this.getTimeToReach(source, destination);

    setTimeout(() => destination.receiveFleet(playerId, unitsAmount), timeToReach);

    return { unitsAmount, timeToReach };
  }

  getTimeToReach(p1: Planet, p2: Planet): number {
    const dist = getDistanceBetweenPoints(p1.x, p1.y, p2.x, p2.y);
    const timeToReach = dist * SPEED;
    return timeToReach;
  }
}