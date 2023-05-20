export default interface Game {
  id: string;
  isStarted: boolean;
  isEnded: boolean;
  player1?: string;
  player2?: string;
  planets: any[];
  intervals: NodeJS.Timer[]
}