export interface Rating {
    id: number;
    task_id: number;
    user_id: string;
    score: number;
}

export interface CreateRatingParams {
    taskId: number;
}

export interface CreateRatingBody {
    score: number;
}

export interface CreateRatingResponse {
    rating: Rating;
}

declare module 'fastify' {
    interface FastifyRequest {
        params: CreateRatingParams;
        body: CreateRatingBody;
        user: {
            sub: string;
        };
    }
}