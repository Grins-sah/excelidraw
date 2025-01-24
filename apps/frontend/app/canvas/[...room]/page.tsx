"use client"
import Canvas1 from "@/components/icons/Canvas";
import React from "react"

export default   function Canvas({params}:{
params:string
}){
    const paramsRes =  React.use(params);
    return <div className="w-screen h-screen">
        <Canvas1 roomId={paramsRes.room[0]} />
    </div>
}
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    // const session = useSession();
    // useEffect(()=>{
    //     if(!canvasRef.current) return ; 
    //     const canvas = canvasRef.current;
    //     canvas.height = document.body.clientHeight; 
    //     canvas.width = document.body.clientWidth;
    //     Drawinit(canvasRef,paramsRes.room[0],session);
    // },[canvasRef])
    // return <div className="w-screen h-screen">
    //     <canvas  ref={canvasRef} className="bg-black">

    //     </canvas>
    // </div>