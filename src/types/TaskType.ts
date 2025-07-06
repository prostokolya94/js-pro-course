export interface Task {
    id: number;
    title: string;
    description: string;
    author_id: string;
}

export interface CreateTaskBody {
    title: string;
    description: string;
}

export interface CreateTaskResponse {
    task: Task;
}

export interface GetTasksQueryParams {
    page?: number;
    limit?: number;
}

export interface GetTasksResponse {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
}

declare module 'fastify' {
    interface FastifyRequest {
        query: GetTasksQueryParams;
        body: CreateTaskBody;
        user: {
            sub: string;
        };
    }
}