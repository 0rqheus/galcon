import { PlanetDetails } from "./PlanetDetails"
import { User } from "./User"

export interface GameDetails {
  id: string,
  players: User[],
  map: {
    w: number,
    h: number,
    planetArray: PlanetDetails[]
  }
}