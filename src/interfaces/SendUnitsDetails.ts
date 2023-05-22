export interface SendUnitsDetails {
  sender: string,
  unitsAmount: number,
  timeToReachInSec: number,
  sourcePlanetId: number,
  destinationPlanetId: number
}