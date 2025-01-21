import { WebSocket,WebSocketServer } from "ws";
import {JWT_SECRET} from '@repo/backend-common/config'
import jwt from 'jsonwebtoken'
import { prismaClient } from "@repo/db/client"
const wss:WebSocketServer=  new WebSocketServer({port:8080});
interface user{
    ws:WebSocket,
    rooms :number[],
    userId:string
}
const users:user[] = [];
function checkUser(token:string):string | null{
    try{
        const data = jwt.verify(token,JWT_SECRET);
        if(typeof data === 'object'){
            return data.id;
        }
    }catch(e){
        return null;
    }
    return null;

}
wss.on("connection",(ws:WebSocket,request)=>{
    const url = request.url;
    if(!url){
        return ;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || " ";
    const userId = checkUser(token);
    if(!userId) {
        ws.close();
        return;
    }
    users.push({
        userId,
        ws,
        rooms:[]
    })
    ws.on('message',async (data)=>{
        const parsedData = JSON.parse(data as unknown as string);
        console.log(parsedData);
        if(parsedData.type === 'join_room'){
            const user = users.find(x => x.ws === ws);
            if(!user){
                ws.close();
                return;
            }
            user.rooms.push(parsedData.roomId);
        }
        else if(parsedData.type === 'leave_room'){
            const user = users.find((x)=> x.ws==ws)
            if(!user){
                ws.close();
                return ;
            }
            user.rooms = user.rooms.filter(x=>x===parsedData.room);

        }else if(parsedData.type === 'chat'){
            console.log("chat");
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            const dbres =await prismaClient.chat.create({
                data:{
                    roomId:roomId,
                    message:message,
                    userId:userId
                }
            })
            console.log(dbres);
            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId:roomId
                    }))
                }
            })
        }
    })




})