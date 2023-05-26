import { PlanetDetails } from "../interfaces";
import { Point } from "./Point";

export class Planet {
  public readonly id: number;
  private ownerId: string | null;
  private radius: number;
  private _fleet: number;
  private coords: Point;
  private fleetGenSpeed: number;

  constructor(id: number, ownerId: string | null, size: number, fleet: number, coords: Point) {
    this.id = id;
    this.ownerId = ownerId;
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

  get ownerID() {
    return this.ownerId;
  }

  set owner(newOwnerId: string) {
    this.ownerId = newOwnerId
  }

  get fleet(): number {
    return this._fleet;
  }

  public updateFleet(ships: number) {
    this._fleet += ships
  }

  public produceShips() {
    if (this.owner !== null) {
      this._fleet += this.fleetGenSpeed
    }
  }

  public sendFleet() {
    let ships: number = Math.floor(this.fleet / 2);
    this.updateFleet(-ships);
    return ships;
  }

  public receiveFleet(senderId: string, amount: number) {
    if (this.owner === senderId) {
      this._fleet += amount
    } else {
      if (this.fleet >= amount) {
        this._fleet -= amount
      } else {
        this._fleet += amount - this.fleet
        this.ownerId = senderId;
      }
    }
  }

  getPlanetDetails(): PlanetDetails {
    return {
      id: this.id,
      ownerId: this.ownerId,
      coords: this.coords,
      radius: this.radius,
      fleet: this.fleet,
      fleetGenSpeed: this.fleetGenSpeed,
    }
  }
}
