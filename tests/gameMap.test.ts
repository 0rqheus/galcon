import { GameMap } from "../src/entities/GameMap"
import { Planet } from "../src/entities/Planet";
import { User } from "../src/interfaces/User";

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
} from "../src/config"

import { Point } from "../src/entities/Point";

describe("GameMap", () => {
  let gameMap: GameMap;

  beforeEach(() => {
    gameMap = new GameMap();
  });

  describe("generateMap", () => {
    it("should generate planets with correct number", () => {
      const users: User[] = 
      [
        { 
          id: "goobert",
          name: "goobert",
          color: "black",
          isHost: true
        }, 
        { 
          id: "dumbass",
          name: "dumbass",
          color: "red",
          isHost: false
        }
      ];
      gameMap.generateMap(users);

      expect(gameMap.planetArray.length).toBeGreaterThanOrEqual(2);
      expect(gameMap.planetArray.length).toBeLessThanOrEqual(PLANET_N_MAX);
    });

    it("should generate starter planets with correct properties", () => {
      const users: User[] = 
      [
        { 
          id: "goobert",
          name: "goobert",
          color: "black",
          isHost: true
        }, 
        { 
          id: "dumbass",
          name: "dumbass",
          color: "red",
          isHost: false
        }
      ];
      gameMap.generateMap(users);

      const starterPlanets = gameMap.planetArray.slice(0, 2);
      starterPlanets.forEach((planet) => {
        expect(planet.owner).toBeDefined();
        expect(planet.fleet).toBe(HEALTH_STARTER);
        expect(planet.getPlanetDetails()['radius']).toBe(RADIUS_STARTER);
      });
    });

    it("should generate neutral planets with correct properties", () => {
      const users: User[] = 
      [
        { 
          id: "goobert",
          name: "goobert",
          color: "black",
          isHost: true
        }, 
        { 
          id: "dumbass",
          name: "dumbass",
          color: "red",
          isHost: false
        }
      ];
      gameMap.generateMap(users);

      const neutralPlanets = gameMap.planetArray.slice(2);
      neutralPlanets.forEach((planet) => {
        expect(planet.owner).toBeNull();
        expect(planet.fleet).toBeGreaterThanOrEqual(HEALTH_MIN);
        expect(planet.fleet).toBeLessThanOrEqual(HEALTH_MAX);
        expect(planet.getPlanetDetails()['radius']).toBeGreaterThanOrEqual(RADIUS_MIN);
        expect(planet.getPlanetDetails()['radius']).toBeLessThanOrEqual(RADIUS_MAX);
      });
    });
  });

  describe("getDistanceBetweenPlanets", () => {
    it("should calculate the correct distance between two planets", () => {
      const p1 = new Planet(1, null, 0, 0, new Point(0, 0));
      const p2 = new Planet(2, null, 0, 0, new Point(3, 4));

      const distance = gameMap.getDistanceBetweenPlanets(p1, p2);

      expect(distance).toBe(5);
    });
  });

  describe("checkOverlap", () => {
    it("should return true when planets overlap", () => {
      const overlap = gameMap.checkOverlap(0, 0, 3, 2, 2, 2);

      expect(overlap).toBe(true);
    });

    it("should return false when planets do not overlap", () => {
      const overlap = gameMap.checkOverlap(0, 0, 3, 10, 10, 2);

      expect(overlap).toBe(false);
    });
  });
});
