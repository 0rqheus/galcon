import {
  MAP_W,
  MAP_H,
  PLAYER_COUNT,
  ATTEMPTS,
  RADIUS_STARTER,
  HEALTH_STARTER,
  HEALTH_MIN,
  HEALTH_MAX,
  RADIUS_MIN,
  RADIUS_MAX,
  PLANET_N_MAX,
  PLANET_N_MIN,
  PLANET_DISTANCE_DELTA
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
    return this.planets;
  }

  get print(): string {
    return JSON.stringify(this, null, 2);
  }

  getWinner() {
    let owners = this.planets.map(planet => planet.owner);

    if (owners.every((val, i, arr) => val === arr[0])) {
      return owners[0];
    }

    return null;
  }

  public getDistanceBetweenPlanets(p1: Planet, p2: Planet): number {
    return getDistanceBetweenPoints(p1.x, p1.y, p2.x, p2.y);
  }

  public generateMap(ownersId: string[]) {
    const planetNumber: number = Math.ceil(getRandomFloat(PLANET_N_MIN, PLANET_N_MAX));

    // player starter planets
    for (let i = 0; i < PLAYER_COUNT; i++) {
      this.planets.push(this.generatePlanet(true, i, ownersId[i]));
    }

    // neutral planets
    for (let i = 0; i < planetNumber; i++) {
      let planet: Planet = this.generatePlanet(false, i + PLAYER_COUNT, null);
      this.planets.push(planet);
    }

    return this.planets;
  }

  private generatePlanet(starter: boolean, id: number, owner: string | null) {

    let fleet: number = Math.ceil(getRandomFloat(HEALTH_MIN, HEALTH_MAX));

    let radius: number = Math.floor(getRandomFloat(RADIUS_MIN, RADIUS_MAX));

    if (starter) {
      fleet  = HEALTH_STARTER;
      radius = RADIUS_STARTER;
    }


    let x: number = -1;
    let y: number = -1;

    let generated: boolean = false;

    for (let i = 0; i < ATTEMPTS; i++) {
      generated = true;
      x = getRandomFloat(0 + radius, MAP_W - radius)
      y = getRandomFloat(0 + radius, MAP_H - radius)

      if (this.planets.length > 0) {
        this.planets.forEach(planet => {

          let overlap: boolean = this.checkOverlap( planet.x, planet.y, planet.rad, x, y, radius);

          if (overlap) {
            generated = false;
          }

        })

        if (generated) {
          break;
        }
      }
      else {
        break;
      }
    }
    if (!generated) {
      throw new Error('cannot generate');
    }

    let res: Planet = new Planet(id, owner, radius, fleet, new Point(x, y));

    return res;
  }

  private checkOverlap(x1: number, y1: number, rad1: number, x2: number, y2: number, rad2: number) {
    let distance: number = getDistanceBetweenPoints(x1, y1, x2, y2);
    let minDistance: number = rad1 + rad2 + PLANET_DISTANCE_DELTA;

    return distance < minDistance;
  }

  public updatePlanets() {
    this.planets.forEach((planet) => planet.produceShips());
  }

  getPlanet(id: number) {
    return this.planets.find((p) => p.id === id);
  }
}
