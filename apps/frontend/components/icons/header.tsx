import { signIn, signOut } from "next-auth/react"
import { Draw } from "./draw"

export  function NavBar(){
    return<div className=" h-fit  bg-[#f2f3f7] w-full ">
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
        }} className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Sign Out</button>
        <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">Rooms</button>
        <button className="px-3 mx-1 hover:text-purple-900 hover:font-bold">About Us</button>
      </div>
    </div>
    <div className="w-full  flex flex-col items-center mt-10 font-sans">
      <h1 className="text-3xl  font-bold tracking-tight md:text-4xl text-[hsl(var(--foreground))]">Collaborative Whiteboarding</h1>
      <span className="text-[#173a87] mt-1 p-1 text-3xl  font-bold tracking-tight">Made Simple</span>
      </div>
  </div> 
}