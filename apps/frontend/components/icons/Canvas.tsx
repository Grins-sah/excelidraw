import { Drawinit } from "@/draw";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {RoomCanvas} from "@/components/icons/roomCanvas";


export default function Canvas1({roomId}:{
    roomId:string
}){
    const [socket,setSocket] = useState<WebSocket|null>(null);
    const session = useSession();
    useEffect(()=>{

        if(session.data){
            console.log(session.data.token.token);
            const ws = new WebSocket(`ws://localhost:8080?token=${session.data.token.token}`);
            ws.onopen = ()=>{
                setSocket(ws);
                if(socket)socket.send(JSON.stringify({
                    type:"join_room",
                    roomId:parseInt(roomId)
                }))
            }
            
        }

    },[roomId,session])
    // useEffect(()=>{
    //     console.log(canvasRef);
    // },[canvasRef]);
    if(socket==null ){
        return <div className="">
            server is connecting...
        </div>
    }else{
    return<div className="w-screen h-screen">
        <RoomCanvas roomId={roomId} socket={socket} token={session.data.token.token} />
    </div>
    }
}