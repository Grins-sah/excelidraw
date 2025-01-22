import { ReactNode } from "react"

export function Card({title,body}:{
    title:string,
    body:string
}){
    return <div className="backdrop-blur  shadow-lg shadow-cyan-500/50  h-48 w-72 rounded-3xl -translate-y-6 mx-5 ">
        <div>
            <div className="p-5 ">
                <div><h1 className="text-lg tracking-tight font-semibold">{title} </h1></div>
                <p className="mt-4 text-muted-foreground">
                {body}
              </p>
                
            </div>
        </div>
    </div>
}