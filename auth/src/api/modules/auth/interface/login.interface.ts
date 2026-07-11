import { users } from "generated/prisma/client";

export interface LoginResponse {
    access_token: string,
    refresh_token: string,
    expires: Date,
    expires_at:number,
    refresh_token_expires: Date, 
    user: users
}