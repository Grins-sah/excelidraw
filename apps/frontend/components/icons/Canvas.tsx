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
            const ws = new WebSocket(`ws://localhost:8080?token=${localStorage.getItem('token')}`);
            ws.onopen = ()=>{
                setSocket(ws);
                ws.send(JSON.stringify({
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
    }else if(socket && localStorage.getItem("token")){
    return<div className="w-screen h-screen">
        <RoomCanvas roomId={roomId} socket={socket} token={localStorage.getItem("token")} />
    </div>
    }
}