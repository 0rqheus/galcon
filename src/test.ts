import { GameMap } from "./entities/map";


let mapp: GameMap = new GameMap()

mapp.generateMap()

console.log(mapp.print)

console.log(mapp.checkEndgame)