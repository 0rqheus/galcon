import { PlanetDetails } from "./PlanetDetails"

export interface GameDetails {
  id: string,
  player1: string,
  player2: string,
  map: {
    w: number,
    h: number,
    planetArray: PlanetDetails[]
  }
}