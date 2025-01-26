export default function RoomCard({title,CreatedAt,className,roomId,onClick}:{
    title:string,
    CreatedAt:string,
    className?:string,
    roomId:number,
    onClick?:()=>void
}){
    return <button onClick={onClick} className = {`backdrop-blur  shadow-lg shadow-cyan-500/50  h-48 w-72 rounded-3xl translate-y-6 mx-16 ${className}`} >
    <div>
        <div className="w-fit ">
            <div><h1 className="text-3xl italic tracking-tight font-semibold ">{title} </h1></div>
            <ul className="flex flex-col justify-start">

                <li > Room Id :- {roomId}</li>
                <li > Created By {localStorage.getItem("user")}</li>
                <li > Created At {CreatedAt}</li>

            </ul>
            
        </div>
    </div>
    </button>
}