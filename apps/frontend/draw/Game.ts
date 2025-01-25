import axios from "axios";
export type Tool = "rect" | "circle" | "pencil";
export async function getExistingShapes(roomId:number,token:string){
    const res = await axios.get(`http://localhost:3001/chats/${roomId}`,{
        headers:{
            token:token
        }
    });
    const message = res.data.msg;
    const shapes = message.map((x:{message:string})=>{
        const messageData = JSON.parse(x.message)
        return messageData
    })
    console.log(shapes);
    return shapes
}
type shape = {
    type :"rect",
    startX:number,
    startY:number,
    height:number,
    width:number
} | {
    type:"circle",
    startX: number,
    startY:number,
    height:number,
    width:number
} | {
    type: "pencil";
    startX: number;
    startY: number;
    height: number;
    width: number;
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes:shape[]
    private roomId: number;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: "rect"|"circle"|"pencil" = "rect";
    private token:string = ""
    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket,token :string) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.token = token
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup",this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler)
    }

    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId,this.token);
        console.log(this.token);
        console.log(this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.clearCanvas();

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
       this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.existingShapes.forEach((shape:shape)=>{
            if(shape.type == "rect"){
               this.ctx.strokeStyle = "white",
               this.ctx.strokeRect(shape.startX,shape.startY,shape.width,shape.height);
            }else if(shape.type === "circle"){
                const centerX =shape.startX + shape.width/2.0;
                const centerY = shape.startY +shape.height/2;
                const radius = Math.max(shape.height,shape.width) /2;
               this.ctx.beginPath();
               this.ctx.arc(centerX,centerY,radius,0,Math.PI*2)
               this.ctx.stroke();
               this.ctx.beginPath();
            }
        })
    }



    mouseDownHandler = (e) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
    }
    mouseUpHandler = (e) => {
        this.clicked = false; 
            this.existingShapes.push({
                type:this.selectedTool,
                startX:this.startX,
                startY:this.startY,
                height:e.clientY - this.startY,
                width:e.clientX-this.startX
            })
            this.socket.send(JSON.stringify({
                type:"chat",
                roomId:parseInt(this.roomId),
                message:JSON.stringify({
                    //@ts-ignore
                    type:this.selectedTool,
                    startX:this.startX,
                    startY:this.startY,
                    height:e.clientY-this.startY,
                    width:e.clientX-this.startX
                })
            }))
    }
    mouseMoveHandler = (e) => {
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            //@ts-ignore
            const selected = this.selectedTool;
            if(selected === "rect"){
                this.ctx?.strokeRect(this.startX,this.startY,width,height);
            }else if(selected === "circle"){
                const centerX =this.startX + width/2.0;
                const centerY = this.startY +height/2;
                const radius = Math.max(height,width) /2;
                this.ctx.beginPath();
                this.ctx.arc(centerX,centerY,radius,0,Math.PI*2)
                this.ctx.stroke();
                this.ctx.beginPath();

            }

            this.ctx.strokeStyle = "white"
       
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown",this.mouseDownHandler)

        this.canvas.addEventListener("mouseup",this.mouseUpHandler)

        this.canvas.addEventListener("mousemove",this.mouseMoveHandler)    

    }
}