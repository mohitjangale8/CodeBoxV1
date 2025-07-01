import { WebSocketServer } from "ws";
import { GameManager } from "./GameManger.js";


const wss=new WebSocketServer({port:8080})
console.log("new415")

const gameManager=new GameManager();
wss.on("connection",function connection(ws){
  gameManager.addUser(ws)
})