import { Drawinit } from "@/draw";
import { Game, Tool } from "@/draw/Game";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { useEffect, useRef, useState } from "react";
export  function RoomCanvas({roomId,socket,token}:{
    roomId:number,
    socket:WebSocket,
    token:string
}){
    const [option ,setOption] = useState("rect")
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        //@ts-ignore
        window.option = option
    },[option])
    useEffect(()=>{
        sessionStorage.getItem("token");
        Drawinit(canvasRef,socket,parseInt(roomId),localStorage.getItem("token"))
    },[canvasRef]);
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [game, setGame] = useState<Game>();
    // const [option, setOption] = useState<Tool>("circle")

    // useEffect(() => {
    //     game?.setTool(option);
    // }, [option, game]);

    // useEffect(() => {

    //     if (canvasRef.current) {
    //         const g = new Game(canvasRef.current, parseInt(roomId), socket,token);
    //         setGame(g);

    //         return () => {
    //             g.destroy();
    //         }
    //     }


    // }, [socket,token]);
    return<div><canvas  ref={canvasRef} width={document.body.clientWidth} height={document.body.clientHeight-50} className="bg-black">
    </canvas>
    <div className="bg-gray-800 h-[50px] flex justify-center items-center">
        <button onClick={()=>{
            setOption(()=>"rect")
        }} className="px-5 border text-white rounded-lg mx-5 h-[25px]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
</svg>

        </button>
        <button onClick={()=>{
            setOption(()=>"circle")
        }} className="px-5 border text-white rounded-lg mx-5 h-[25px]">
        <svg height="14" width="14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle r="7" cx="7 " cy="7"  stroke="white" stroke-width="2" />
</svg>
        </button>
        <button onClick={()=>{
            setOption(()=>"pencil")
        }} className="px-5 border text-white rounded-lg mx-5 h-[25px]">
        <svg height="22" width="30" xmlns="http://www.w3.org/2000/svg">
  <line x1="2" y1="2" x2="30" y2="22" stroke="white" stroke-width="2"  />
</svg>
        </button>
        <button onClick={async ()=>{
            const res = await axios.delete("http://localhost:3001/room/"+roomId,{
                headers:{
                    token:localStorage.getItem("token")
                }
            })
            window.alert(res.data.msg);
            
        }} className="px-5 border text-white rounded-lg mx-5 h-[25px]">

        </button>
    </div>
    </div>
}