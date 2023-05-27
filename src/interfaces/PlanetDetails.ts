import { Point } from "../entities/Point";
import { User } from "./User";

export interface PlanetDetails {
  id: number,
  owner: User | null,
  coords: Point,
  radius: number,
  fleet: number,
  fleetGenSpeed: number,
}