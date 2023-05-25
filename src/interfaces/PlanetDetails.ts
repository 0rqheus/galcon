import { Point } from "../entities/Point";

export interface PlanetDetails {
  id: number,
  ownerId: string | null,
  coords: Point,
  radius: number,
  fleet: number,
  fleetGenSpeed: number,
}