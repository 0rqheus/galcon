import { GameMap } from "./entities/map";


let mapp: GameMap = new GameMap()

let ownersId = [1, 2, 3, 4, 6, 4, 0]

mapp.generateMap(ownersId)

console.log(mapp.print)

console.log(mapp.checkEndgame)