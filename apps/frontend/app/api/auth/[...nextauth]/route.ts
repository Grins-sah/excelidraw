import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import {CreateUserSchema} from '@repo/common/types'
import GitHubProvider from "next-auth/providers/github"
import { z } from "zod"
import axios from "axios"
type UserSchema = z.infer<typeof CreateUserSchema>;
const handler = NextAuth({
  providers:[
    CredentialsProvider({
        name:"Credential",
        credentials:{
            name:{label:"username" , type:"text" , placeholder:"Enter your name"},
            email:{label:"email", type:"email" , placeholder:"youremail@provider"},
            password:{label:"password",type:"password",placeholder:"Enter the password"}
        },
        //@ts-ignore
        async authorize(credentials:UserSchema,req){
          console.log(credentials);
          const res =await axios.post(`${process.env.backend_url}signin`,{
            "name":credentials.name,
            "email":credentials.email,
            "password":credentials.password
          })
          if(res.status==205){
            const res2 = await axios.post(`${process.env.backend_url}signup`,{
              "password":credentials.password,
              "name":credentials.name,
              "email":credentials.email
            })
            if(res2.status==200){
              return res2.data.msg
            }else{
              return null;
            }
          }else{
            const user = res.data.msg;
            return{
              id:user.userId,
              name:user.name,
              token:user.token,
              email:user.email,
              type:"crendential"
            }
          }
        }
    }),
    Google({
        clientId: process.env.clientId_google,
        clientSecret: process.env.clientSecret_google,
        authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
        }
      }),
      GitHubProvider({
        clientId: process.env.clientId_gitHub,
        clientSecret:process.env.clientSecret_gitHub
      })
      
  ],
  secret:process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log(user);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        if(user.type){
          token.type=user.type;
          token.token = user.token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log(token);
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      if(token.type){
        session.user.token = token.token;
        return session;
      }
      const credentials = token
      const res =await axios.post(`${process.env.backend_url}signin`,{
        "name":credentials.name,
        "email":credentials.email,
        "password":credentials.password
      })
      if(res.status==205){
        console.log(credentials);
        const res2 = await axios.post(`${process.env.backend_url}signup`,{
          "name":credentials.name,
          "email":credentials.email,
          "photo":credentials.image,
          "type":"provider"
      
        })
        if(res2.status==200){
          session.token=res2.data.msg.token
        }else{
           session.token = "";
        }
      }else{
        session.token = res.data.msg.token
      }
      return session;
    },
  }
})

export { handler as GET, handler as POST }