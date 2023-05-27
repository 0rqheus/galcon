import { User } from "./User";

export interface GameParticipants {
  gameId: string,
  players: User[],
}