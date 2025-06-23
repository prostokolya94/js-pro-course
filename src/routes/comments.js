const fp = require('fastify-plugin');

async function commentRoutes(fastify, opts) {
    // Добавление комментария к задаче
    fastify.post('/tasks/:taskId/comments', {
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
                required: ['content'],
                properties: {
                    content: { type: 'string' }
                }
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        comment: { $ref: 'comment.json#' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { taskId } = request.params;
            const userId = request.user.sub;
            const { content } = request.body;

            const result = await fastify.pg.query(
                'INSERT INTO comments (task_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
                [taskId, userId, content]
            );

            reply.code(201).send({ comment: result.rows[0] });
        }
    });

    // Получение комментариев к задаче
    fastify.get('/tasks/:taskId/comments', {
        schema: {
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['taskId'],
                properties: {
                    taskId: { type: 'integer' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        comments: { type: 'array', items: { $ref: 'comment.json#' } }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { taskId } = request.params;

            const comments = await fastify.pg.query(
                'SELECT * FROM comments WHERE task_id = $1 ORDER BY id',
                [taskId]
            );

            reply.send({ comments: comments.rows });
        }
    });
}

module.exports = fp(commentRoutes);