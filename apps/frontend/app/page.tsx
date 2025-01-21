"use client"
import { Draw } from "@/components/icons/draw";

export default function Home(){
  return <div>
    <div className="bg-[#f0f2fa] h-96 flex justify-center ">
        <div className=" h-fit  bg-[#f2f3f7] w-full flex justify-between p-3">
            <div className="text-xl  w-fit flex">
                <Draw />
                <button onClick={()=>{
                  window.open("/","_self")
                }} className="w-fit hover:text-[#010826] font-bold">Excelidraw clone</button>
            </div>
            <div className="flex text-xl mx-1 font-medium	  text-gray-900 	">
              <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Sign in</button>
              <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Sign up</button>
              <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Rooms</button>
              <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">About Us</button>
            </div>
        </div>
        <div className="flex items-center">

        </div>
    </div>
  </div>
}