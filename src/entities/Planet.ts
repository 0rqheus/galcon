import { PlanetDetails } from "../interfaces";
import { User } from "../interfaces/User";
import { Point } from "./Point";

export class Planet {
  public readonly id: number;
  private _owner: User | null;
  private radius: number;
  private _fleet: number;
  private coords: Point;
  private fleetGenSpeed: number;

  constructor(id: number, owner: User | null, size: number, fleet: number, coords: Point) {
    this.id = id;
    this._owner = owner;
    this.radius = size;
    this._fleet = fleet;
    this.coords = coords;
    this.fleetGenSpeed = this.getGenerationSpeed(this.radius)
  }


  private getGenerationSpeed(size: number) {
    return Math.ceil(size * 2);
  }

  get x(): number {
    return this.coords.x
  }

  get y(): number {
    return this.coords.y
  }

  get rad(): number {
    return this.radius;
  }

  get diam(): number {
    return this.radius * 2;
  }

  get print(): string {
    return JSON.stringify(this, null, 2)
  }

  get owner() {
    return this._owner;
  }

  set owner(newOwner: User | null) {
    this._owner = newOwner
  }

  get fleet(): number {
    return this._fleet;
  }

  public produceShips() {
    if (this.owner !== null) {
      this._fleet += this.fleetGenSpeed
    }
  }

  public sendFleet() {
    let ships: number = Math.floor(this.fleet / 2);
    this._fleet -= ships
    return ships;
  }

  public receiveFleet(sender: User, amount: number) {
    if (this.owner?.id === sender.id) {
      this._fleet += amount
    } else {
      if (this.fleet >= amount) {
        this._fleet -= amount
      } else {
        this._fleet += amount - this.fleet
        this.owner = sender;
      }
    }
  }

  getPlanetDetails(): PlanetDetails {
    return {
      id: this.id,
      owner: this.owner,
      coords: this.coords,
      radius: this.radius,
      fleet: this.fleet,
      fleetGenSpeed: this.fleetGenSpeed,
    }
  }
}
