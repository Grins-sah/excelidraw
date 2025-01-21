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

app.post("/signup",async (req:RequestUser,res:Response)=>{
    const data = req.body;
    const result = CreateUserSchema.safeParse(data);
    if(result.success){
        try{
            result.data.password = await bcrypt.hash(result.data.password,5); 
            const dbRes = await prismaClient.user.create({
                data:result.data
            })
            res.send({
                msg:dbRes
            })
        }catch(e){
            res.send({
                msg:e
            })
        }
    }else{
        res.send({
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
    if(result.success){
        try{
            const resdb = await prismaClient.user.findUnique({
                where:{
                    email:result.data.email
                }
            })
            if(resdb==null){
                res.send({
                    msg:"User not found"
                })
                return ;
            }
            const passResult = await bcrypt.compare(result.data.password,resdb.password);
            if(passResult){
                const token = jwt.sign({
                    email:resdb.email,
                    id:resdb.id
                },JWT_SECRET)
                res.send({
                    msg:token
                })
            }else{
                res.send({
                    msg:"login failed"
                })
                return;
            }
        }catch(e){
            res.send({
                msg:e
            })
            return;
        }
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
app.listen(3000,()=>{
    console.log("The server is running on port 3000")
})