import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateRatingBody, CreateRatingParams, CreateRatingResponse } from "../types/RatingTypes";

async function ratingRoutes(fastify: FastifyInstance, opts: unknown) {
    fastify.post<{
        Params: CreateRatingParams;
        Body: CreateRatingBody;
        Reply: CreateRatingResponse;
    }>('/tasks/:taskId/ratings', {
        schema: {
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['taskId'],
                properties: {
                    taskId: { type: 'integer' }
                }
            },
            body: {
                type: 'object',
                required: ['score'],
                properties: {
                    score: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 5
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        rating: { $ref: 'rating.json#' }
                    }
                }
            }
        },
        handler: async (
            request: FastifyRequest,
            reply: FastifyReply
        ): Promise<CreateRatingResponse> => {
            const { taskId } = request.params;
            const userId = request.user.sub;
            const { score } = request.body;

            const task = await fastify.pg.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
            if (!task.rows[0]) {
                reply.code(404).send({ error: 'Задача не найдена' });
                return;
            }

            const existingRating = await fastify.pg.query(
                'SELECT * FROM ratings WHERE task_id = $1 AND user_id = $2',
                [taskId, userId]
            );

            const query = existingRating.rows[0]
                ? 'UPDATE ratings SET score = $1 WHERE task_id = $2 AND user_id = $3 RETURNING *'
                : 'INSERT INTO ratings (task_id, user_id, score) VALUES ($1, $2, $3) RETURNING *';

            const result = await fastify.pg.query(query, [score, taskId, userId]);

            await fastify.pg.query(
                `UPDATE tasks 
                 SET average_rating = (
                   SELECT AVG(score) 
                   FROM ratings 
                   WHERE task_id = $1
                 )
                 WHERE id = $1`,
                [taskId]
            );

            return { rating: result.rows[0] };
        }
    });
}

export default fp(ratingRoutes);