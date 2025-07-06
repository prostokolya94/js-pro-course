import {User} from "../types/UserTypes";

export interface LoginBody {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

declare module 'fastify' {
    interface FastifyRequest {
        body: LoginBody;
        user: User;
    }
}