import {
  MAP_W,
  MAP_H,
  PLANET_D_MAX_DIVISOR,
  PLANET_D_MIN_DIVISOR,
  ATTEMPTS,
  MAX_HEALTH,
  MIN_HEALTH,
  PLANET_STARTER_HEALTH,
  PLANET_STARTER_D,
  PLANET_N_MAX,
  PLANET_N_MIN,
  PLAYER_COUNT
} from "../config";
import { getDistanceBetweenPoints, getRandomFloat } from "../utils/utils";
import { Point } from "./Point";

import { Planet } from "./Planet";

export class GameMap {
  private readonly planets: Planet[];
  private readonly width: number;
  private readonly height: number;

  constructor() {
    this.planets = [];
    this.width = MAP_W;
    this.height = MAP_H;
  }

  get w(): number {
    return this.width;
  }

  get h(): number {
    return this.height;
  }

  get planetArray(): Planet[] {
    return this.planets
  }

  get print(): string {
    return JSON.stringify(this, null, 2)
  }

  getWinner() {
    let owners = this.planets.map(planet => planet.owner);

    if (owners.every((val, i, arr) => val === arr[0])) {
      return owners[0]
    }

    return null;
  }

  public getDistanceBetweenPlanets(p1: Planet, p2: Planet): number {
    return getDistanceBetweenPoints(p1.x, p1.y, p2.x, p2.y)
  }

  public generateMap(ownersId: string[]) {
    const planetNumber: number = Math.ceil(getRandomFloat(PLANET_N_MIN, PLANET_N_MAX))

    // player starter planets
    for (let i = 0; i < PLAYER_COUNT; i++) {
      this.planets.push(this.generatePlanet(true, i, ownersId[i]))
    }

    // neutral planets
    for (let i = 0; i < planetNumber; i++) {
      let planet: Planet = this.generatePlanet(false, i + PLAYER_COUNT, null);
      this.planets.push(planet)
    }

    return this.planets
  }

  private generatePlanet(starter: boolean, id: number, owner: string | null) {
    // planet should not take too much space.
    // diameter will not be more than minsize / max_divisor
    let minDim: number = this.w > this.h ? this.h : this.w;
    console.log(minDim)

    // 0. generate health/fleet
    let fleet: number = Math.ceil(getRandomFloat(MIN_HEALTH, MAX_HEALTH))
    // 1. generate radius/diameter
    let diameter: number = getRandomFloat(
      minDim / PLANET_D_MIN_DIVISOR,
      minDim / PLANET_D_MAX_DIVISOR);

    if (starter) {
      fleet = PLANET_STARTER_HEALTH
      diameter = PLANET_STARTER_D
    }
    console.log(diameter)
    let radius: number = diameter / 2;


    // 2. generate coordinates
    // a cycle that generates until its ok
    let x: number = -1;
    let y: number = -1;

    let generated: boolean = false;

    for (let i = 0; i < ATTEMPTS; i++) {
      generated = true;
      x = getRandomFloat(0 + radius, MAP_W - radius)
      y = getRandomFloat(0 + radius, MAP_H - radius)

      if (this.planets.length > 0) {
        this.planets.forEach(planet => {

          let overlap: boolean = this.checkOverlap(
            planet.x, planet.y, planet.rad,
            x, y, radius)

          if (overlap) {
            generated = false
          }

        })

        if (generated) {
          break
        }
      }
      else {
        break
      }
    }
    if (!generated) {
      throw new Error('cannot generate')
    }

    let res: Planet = new Planet(id, owner, radius, fleet, new Point(x, y))

    return res;
  }

  private checkOverlap(x1: number, y1: number, rad1: number, x2: number, y2: number, rad2: number) {
    // overlap is when distance between points
    // is less than sum of radiuses
    let distance: number = getDistanceBetweenPoints(x1, y1, x2, y2);
    let minDistance: number = rad1 + rad2;

    return distance < minDistance;
  }

  public updatePlanets() {
    this.planets.forEach((planet) => planet.produceShips());
  }

  getPlanet(id: number) {
    return this.planets.find((p) => p.id === id);
  }
}
