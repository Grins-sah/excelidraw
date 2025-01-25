"use client"

import { Card } from "@/components/icons/Card";
import { Draw } from "@/components/icons/draw"
import { NavBar } from "@/components/icons/header";
import {RoomsAvailable} from "@/components/icons/RoomAvailable";
import RoomCard from "@/components/roomCard";
import axios from "axios";
import { signIn, signOut } from "next-auth/react"
import { headers } from "next/headers";
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react";
type res1  = {
  id: number;
  slug: string;
  createdAt: Date;
  adminId: string;
}
export default function Roompage(){
  const inputRef = useRef(null);
  const router = useRouter();
    const token = localStorage.getItem("token");
    const [data,setData] = useState<res1[]|null>(null);
    //@ts-ignore
    useEffect( ()=>{
      async function fetch(){
        const res = await axios.get(`http://localhost:3001/room`,{
          headers:{
              token:token
          }   
        })
        const dataRes: res1[] = res.data.msg;
        setData(dataRes);
      }
      fetch();
  },[])

  if(data===null){
    return <div>
        NO rooms present till now
    </div>
}
console.log(data);
return <div>
  <NavBar/>
  <div className="flex justify-center w-screen"><h1 className="text-3xl tracking-tight font-bold">Rooms Present</h1></div>
    <div className="flex ">
      {data.map((e)=>{
        return <RoomCard onClick={()=>{
          router.push("http://localhost:3000/canvas/"+e.id)  
        }}  className="translate-y-6" title={e.slug} CreatedAt={e.createdAt} roomId={e.id}  />
      })}
        <div className="backdrop-blur translate-y-6  shadow-lg shadow-cyan-500/50  h-48 w-72 rounded-3xl mx-16 outline outline-dotted flex flex-col justify-center items-center ">
          <div className="mt-5  rounded-full p-2"><input ref={inputRef} className="p-2 outline outline-dotted rounded-full" type="text" placeholder="Create Room" /></div>
          <div className="">
            <button onClick={async ()=>{
              console.log(token);
              const res = await axios.post(
                "http://localhost:3001/room",
                {
                  name:inputRef.current.value
                }, // Request body (can be empty)
                {
                  headers: {
                    token
                  },
                }
              );
              window.alert(res.data.msg);
              location.reload();
            }} className="h-12 text-lg mt-2 px-6 pt-2 bg-blue-600 rounded-full flex w-fit text-white"> create room</button>
          </div>
        </div>
    </div>

</div>
}