import { NextFunction, Request, Response } from "express";
import jwt, { JwtHeader, JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config";
import { string } from "zod";
interface middlewareReq extends Request{
    email?: string
    id?: number
}
export function middleware (req:middlewareReq,res:Response,next:NextFunction){
    if(!req.headers.token){
        res.send({
            msg:"Token not present"
        })
        return ;
    }
    const token= req.headers.token;
    if(typeof token !== "string"){
        res.send({
            msg:"Token not present"
        })
        return ;
    }
    try{
        const data = jwt.verify(token,JWT_SECRET)
        if(typeof data === 'object'){
            req.email = data.email;
            req.id = data.id
            next();
        }
    }catch(e){
        res.send({
            msg:e
        })
        return;
    }
}