import { z } from "zod";

export const CreateUserSchema = z.object({
    password: z.string().optional(),
    name: z.string(),
    email:z.string().email(),
    type:z.string().optional(),
    photo:z.string().optional()
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().optional(),
    name:z.string(),
    type:z.string().optional()
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})
