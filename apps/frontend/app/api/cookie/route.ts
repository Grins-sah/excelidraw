import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
 
export async function GET() {
    const cookieStore = await cookies()
    const data = cookieStore.get("token");

    return NextResponse.json({
        data
    })
}