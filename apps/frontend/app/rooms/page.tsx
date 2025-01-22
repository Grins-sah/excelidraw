"use client"

import { Draw } from "@/components/icons/draw"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function Room(){
    const router = useRouter();
    return <div>
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
              }} className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Sign in</button>
              <button onClick={()=>{
                signOut()
                router.push("/")

              }} className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Sign Out</button>
              <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Rooms</button>
              <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">About Us</button>
            </div>
          </div>

        </div>
    </div>
}