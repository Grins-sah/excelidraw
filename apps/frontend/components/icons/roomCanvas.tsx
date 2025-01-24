import { Drawinit } from "@/draw";
import { useEffect, useRef, useState } from "react";
export  function RoomCanvas({roomId,socket,token}:{
    roomId:string,
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
        Drawinit(canvasRef,socket,parseInt(roomId),token)
    },[canvasRef]);
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
            setOption(()=>"line")
        }} className="px-5 border text-white rounded-lg mx-5 h-[25px]">
        <svg height="22" width="30" xmlns="http://www.w3.org/2000/svg">
  <line x1="2" y1="2" x2="30" y2="22" stroke="white" stroke-width="2"  />
</svg>
        </button>
    </div>
    </div>
}