export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'interviewer' | 'user';
    rating: number;
}

export interface GetUserQueryParams {
    page?: number;
    limit?: number;
}

export interface GetUsersResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateUserBody {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'interviewer' | 'user';
}

export interface CreateUserResponse {
    user: User;
}

declare module 'fastify' {
    interface FastifyRequest {
        query: GetUserQueryParams;
        body: CreateUserBody;
    }
}