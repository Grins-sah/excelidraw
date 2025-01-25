import {prismaClient} from '@repo/db/client'
import {CreateUserSchema,CreateRoomSchema,SigninSchema} from '@repo/common/types'
import express, { application, Application, Request, response, Response } from 'express'
import {z} from 'zod'
import {JWT_SECRET} from '@repo/backend-common/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { middleware } from './middleware'
import cors from 'cors'
const app:Application = express();
app.use(cors())
app.use(express.json());
type users = z.infer<typeof CreateUserSchema>;

interface RequestUser extends Request{
    body:users
}
interface roomReq extends Request{
    id?:string
}

app.post("/signup",async (req:RequestUser,res:Response)=>{
    const data = req.body;
    const result = CreateUserSchema.safeParse(data);
    console.log("signup");
    console.log(result);
    if(result.success){
        try{
            const type = data.type;
            if(type==undefined){
                if(!result.data.password) return;
                result.data.password = await bcrypt.hash(result.data.password,5); 
                const dbRes = await prismaClient.user.create({
                    data:result.data
                })
                res.send({
                    msg:dbRes
                })
            }else{
                const dbRes = await prismaClient.user.create({
                    data:{
                        name:data.name,
                        email:data.email,
                        type:data.type,
                        photo:data.photo
                    }
                })
                const token = jwt.sign({
                    email:dbRes.email,
                    id:dbRes.id
                },JWT_SECRET)
                //@ts-ignore
                dbRes.token = token;
                res.send({
                    msg:dbRes
                })
            }

        }catch(e){
            res.status(205).send({
                msg:e
            })
        }
    }else{
        res.status(205).send({
            msg:result.error
        })
    }
})
type signinType = z.infer<typeof SigninSchema>;
interface RequestUserSignin extends Request{
    body:signinType
}
app.post("/signin",async  (req:RequestUserSignin,res:Response)=>{
    const data = req.body;
    const result = SigninSchema.safeParse(data);
    console.log("signin");
    console.log(result);
    if(result.success){
        try{
            const resdb = await prismaClient.user.findUnique({
                where:{
                    email:result.data.email
                }
            })
            if(resdb==null){
                res.status(205).send({
                    msg:"User not found"
                })
                console.log("return") 
                return;
            }
            if(resdb.type=="provider"){
                const token = jwt.sign({
                    email:resdb.email,
                    id:resdb.id
                },JWT_SECRET)
                res.send({
                    msg:{
                        token:token,
                        userId:resdb.id,
                        name:resdb.name,
                        email:resdb.email
                    }
                })
                console.log("return") 
                return;
            }
            if(!result.data.password){
                console.log("return") 
                return;
            } 
            if(!resdb.password){
                console.log("return") 
                return;
            }
            const passResult = await bcrypt.compare(result.data.password,resdb.password);
            if(passResult){
                const token = jwt.sign({
                    email:resdb.email,
                    id:resdb.id
                },JWT_SECRET)
                res.send({
                    msg:{
                        token:token,
                        userId:resdb.id,
                        name:resdb.name,
                        email:resdb.email
                    }
                })
                console.log("return");
                return
            }else{
                res.status(205).send({
                    msg:"login failed"
                })
                console.log("return");
                return
            }
        }catch(e){
            res.status(205).send({
                msg:e
            })
            console.log("return");
            return
        }
    }else{
        res.status(205).send({
            msg:"failed"
        })
        console.log("return");
        return;
    }
})
interface reqRoom extends Request{
    id?:string
}
app.post("/room",middleware,async (req:reqRoom,res)=>{
    const parseData = CreateRoomSchema.safeParse(req.body);
    if(!parseData.success){
        res.send({
            msg:parseData.error
        })
        return;
    }
    if(!req.id){
        console.log(req);
        res.send({
            msg:"failed"
        })
        return;
    }
    try{
        const dbres = await prismaClient.room.create({
            data:{
                slug:parseData.data.name,
                adminId:req.id
            }
        })
        if(dbres){
            res.send({
                msg:`room create with name ${dbres.slug} && room id ${dbres.id}`
            })
            return;
        }
        return;
    }catch(e){
        res.send({
            msg:e
        })
    }
})
app.get("/room",middleware,async (req:roomReq,res:Response):Promise<void>=>{
    console.log("room");
    const id = req.id
    if(!id){
        res.send({
            msg:"id Not present"
        })
        return;
    }
    try{
        const dbres = await prismaClient.room.findMany({
            where:{
                adminId:id
            },
            take:500
        })
        console.log(dbres);
        res.send({
            msg:dbres
        })
    }catch(e){
        res.send({
            msg:e
        })
    }


})
app.get("/chats/:roomId",middleware,async (req,res)=>{
    const roomId =  Number(req.params.roomId);
    try{
        const data = await prismaClient.chat.findMany({
            where:{
                roomId:roomId
            },orderBy:{
                id:"desc"
            },
            take:1000
        })
        res.send({
            msg:data
        })
        return;
    }catch(e){
        res.send({
            msg:e
        })
    }
})
app.get("/room/:slug",middleware,async (req:reqRoom,res)=>{
    const slug = req.params.slug;
    try{
        const dbres = await prismaClient.room.findFirst({
            where:{
                slug
            }
        })
        res.send({
            msg:dbres
        })
    }catch(e){
        msg:e
    }

})
app.delete("/room/:roomId",middleware,async (req,res)=>{
    const roomId =  Number(req.params.roomId);
    try{
        const resdb  = await prismaClient.chat.deleteMany({
            where:{
                roomId:roomId
            }
        })
        res.send({
            msg:`deleted canvas of roomId ${roomId}`
        })
    }catch(e){
        res.send({
            msg:"failed delete"
        })
    }
})
app.listen(3001,()=>{
    console.log("The server is running on port 3000")
})