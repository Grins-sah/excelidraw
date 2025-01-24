"use client"
import { tokenAtom } from "@/atoms/token";
import { Card } from "@/components/icons/Card";
import { Draw } from "@/components/icons/draw";
import { Session } from "inspector";
import {Pencil,Download,Github} from 'lucide-react'
import { SessionContext, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Present } from "./api/auth/[...nextauth]/route";
function UserData({session}){
  
  if(session.data?.user){
      return <div>user authenticated</div>
    }
    return <div></div>
}
export default function Home(){
  const session = useSession();
  const router = useRouter();
  const setToken = useSetRecoilState(tokenAtom);
  // if(session.status=="authenticated"){
  //   router.push("/rooms")
  // }
  return <div>
    <div className="bg-[#f0f2fa] h-96 flex justify-center ">
        <div className=" h-fit  bg-[#f2f3f7] w-full ">
          <div className="flex w-full flex justify-between p-3">
            <div className="text-xl  w-fit flex">
                <Draw />
                <button onClick={()=>{
                  window.open("/","_self")
                }} className="w-fit hover:text-[#010826] font-bold text-base md:text-xl ">Excelidraw clone</button>
            </div>
            <div className="flex text-base mx-1 font-medium	   text-gray-900 md:text-xl	">
              <button onClick={()=>{
                signIn()
                setToken(t=>{
                  Present = "";
                })
              }} className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Sign in</button>
              <button onClick={()=>{
                signOut()
                Present = "";
              }} className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Sign Out</button>
              <button onClick={()=>{
                router.push("/rooms")
              }} className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Rooms</button>
              <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">About Us</button>
            </div>
          </div>
          <div className="w-full  flex flex-col items-center mt-10 font-sans">
            <h1 className="text-3xl  font-bold tracking-tight md:text-4xl text-[hsl(var(--foreground))]">Collaborative Whiteboarding</h1>
            <span className="text-[#173a87] mt-1 p-1 text-3xl  font-bold tracking-tight">Made Simple</span>
            </div>
        </div>
    </div>
    <div>
      <div className="flex justify-around ">
        <div className="w-fit sm:flex">      <Card title="Real-time Collaboration" body={"Work together with your team in real-time. Share your drawings instantly with a simple link."} />
      <Card title="Multiplayer Editing" body={"   Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time."} />
      <Card title="Smart Drawing" body={"        Intelligent shape recognition and drawing assistance helps you create perfect diagrams."} />
      </div>

      </div>
    </div>
    <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 sm:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to start creating?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
                Join thousands of users who are already creating amazing diagrams and sketches.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button  className="h-12 px-6 pt-2 bg-blue-600 rounded-full flex w-fit text-white ">
                  Open Canvas
                  <Pencil className="ml-2 h-4 w-4" />
                </button>
                <button   className="h-12 px-6 pt-2 bg-blue-600 rounded-full flex w-fit text-white">
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t" >
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Excalidraw Clone. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com/Grins-sah" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Download className="h-5 w-5" />
              </a>
              <UserData session={session}/>
            </div>
          </div>
        </div>
      </footer>

  </div>
}