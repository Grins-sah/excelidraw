import axios from "axios";
import { headers } from "next/headers";
import { eventNames } from "process";
import { RefObject } from "react";
type shape = {
    type: "rect",
    startX: number,
    startY: number,
    height: number,
    width: number
} | {
    type: "circle",
    startX: number,
    startY: number,
    height: number,
    width: number
} | {
    type: "pencil",
    startX: number,
    startY: number,
    height: number,
    width: number
}

export async function Drawinit(canvasRef: RefObject<HTMLCanvasElement | null>, socket: WebSocket, roomId: number, token: string) {
    let existingShapes: shape[] = await getExistingShapes(roomId, token);
    console.log(existingShapes);
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape);
            claerCanvas(existingShapes, canvas, ctx);
        }
    }
    claerCanvas(existingShapes, canvas, ctx)
    let cliked = false;
    let startX = 0;
    let startY = 0;
    canvas.addEventListener("mousedown", (e) => {
        cliked = true;
        startX = e.clientX;
        startY = e.clientY;
        ctx.beginPath();
        if(window.option==="pencil") ctx.moveTo(startX,startY);
    })
    canvas.addEventListener("mouseup", (e) => {
        cliked = false;
        if (window.type !== "pencil") {
            existingShapes.push({
                //@ts-ignore
                type: window.option,
                startX: startX,
                startY: startY,
                height: e.clientY - startY,
                width: e.clientX - startX
            })
        }
        else existingShapes.push({
            //@ts-ignore
            type: window.option,
            startX: startX,
            startY: startY,
            height: e.clientY,
            width: e.clientX
        })
        if (window.option !== "pencil") {
            socket.send(JSON.stringify({
                type: "chat",
                roomId: roomId,
                message: JSON.stringify({
                    //@ts-ignore
                    type: window.option,
                    startX: startX,
                    startY: startY,
                    height: e.clientY - startY,
                    width: e.clientX - startX
                })
            }))

        } else {
            socket.send(JSON.stringify({
                type: "chat",
                roomId: roomId,
                message: JSON.stringify({
                    //@ts-ignore
                    type: window.option,
                    startX: startX,
                    startY: startY,
                    height: e.clientY,
                    width: e.clientX
                })
            }))

        }


    })
    canvas.addEventListener("mousemove", (e) => {
        if (cliked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            claerCanvas(existingShapes, canvas, ctx);
            //@ts-ignore
            const selected = window.option;
            if (selected === "rect") {
                ctx?.strokeRect(startX, startY, width, height);
            } else if (selected === "circle") {
                const centerX = startX + width / 2.0;
                const centerY = startY + height / 2;
                const radius = Math.max(height, width) / 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2)
                ctx.stroke();
                ctx.beginPath();
            } else if (selected === "pencil") {
                ctx.lineTo(e.clientX,e.clientY);
                ctx.stroke();
                ctx.strokeStyle = "white"
            }

            ctx.strokeStyle = "white"

        }
    })
}

function claerCanvas(existingShapes: shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let n = existingShapes.length;
    for(let i=0;i<n;i++){
        let shape:shape = existingShapes[i];
        if (shape.type == "rect") {
            ctx.strokeStyle = "white",
                ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
        } else if (shape.type === "circle") {
            const centerX = shape.startX + shape.width / 2.0;
            const centerY = shape.startY + shape.height / 2;
            const radius = Math.max(shape.height, shape.width) / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2)
            ctx.stroke();
            ctx.beginPath();
        } else{
            ctx.moveTo(shape.startX, shape.startY);
            while(shape.type == "pencil" && i<n-1) {
            shape:shape = existingShapes[i];
            if(shape.type!=="pencil"){
                i--;
                ctx.beginPath();
                break;
            }
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.width, shape.height);
            ctx.stroke();
            ctx.strokeStyle = "white"
            i++;
            }
        }

    }

    existingShapes.forEach((shape: shape) => {
        if (shape.type == "rect") {
            ctx.strokeStyle = "white",
                ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
        } else if (shape.type === "circle") {
            const centerX = shape.startX + shape.width / 2.0;
            const centerY = shape.startY + shape.height / 2;
            const radius = Math.max(shape.height, shape.width) / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2)
            ctx.stroke();
            ctx.beginPath();
        } else while(shape.type == "pencil") {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.width, shape.height);
            ctx.stroke();
            ctx.strokeStyle = "white"
        }
    })
}
async function getExistingShapes(roomId: number, token: string) {
    const res = await axios.get(`http://localhost:3001/chats/${roomId}`, {
        headers: {
            token: token
        }
    });
    const message = res.data.msg;
    const shapes = message.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message)
        return messageData
    })
    return shapes
}