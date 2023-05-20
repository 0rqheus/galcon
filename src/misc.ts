export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) - Math.pow(y2 - y1, 2)) 
  // d=√((x2 – x1)² + (y2 – y1)²
}