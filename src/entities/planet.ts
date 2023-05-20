// interface Coords
// {
//   x: number,
//   y: number,
// }

// interface Planet
// {
//   owner: Owner | null
//   size: number
//   fleetCount: number
//   coords: Coords
// }

export class Point {
  x: number;
  y: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public print() {
    return JSON.stringify(self)
  }
}


export class Planet {
  private id:          number;
  private ownerId:          number | null;
  private radius:             number;
  private fleet:            number;
  private coords:           Point;
  private fleetGenSpeed:    number;

  constructor(id: number, ownerId: number, size: number, fleet: number, coords: Point) {
    this.id       = id;
    this.ownerId       = ownerId;
    this.radius        = size;
    this.fleet         = fleet;
    this.coords        = coords; 
    this.fleetGenSpeed = this.getGenerationSpeed(this.radius)
  }


  private getGenerationSpeed(size: number) {
    return Math.ceil(size * 2);
  }

  get x(): number {
    return this.coords.x
  }

  get y(): number {
    return this.coords.x
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

  get owner(): number | null {
    return this.ownerId;
  }

  set produce(ships: number) {
    // dont care lol we got genspeed
    if (this.owner !== null) {
      this.fleet += this.fleetGenSpeed
    }
  }
}
