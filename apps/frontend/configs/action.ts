'use server'
 
import { cookies } from 'next/headers'
 
export async function create(token:string) {
  const cookieStore = await cookies()
  cookieStore.set("token",token)
  console.log(cookieStore.getAll());
}