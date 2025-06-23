const fp = require('fastify-plugin');

async function taskRoutes(fastify, opts) {
    fastify.post('/tasks', {
        schema: {
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'description'],
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string' }
                }
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        task: { $ref: 'task.json#' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { title, description } = request.body;
            const userId = request.user.sub;

            const result = await fastify.pg.query(
                'INSERT INTO tasks (title, description, author_id) VALUES ($1, $2, $3) RETURNING *',
                [title, description, userId]
            );

            reply.code(201).send({ task: result.rows[0] });
        }
    });

    fastify.get('/tasks', {
        schema: {
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100 }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        tasks: { type: 'array', items: { $ref: 'task.json#' } },
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { page = 1, limit = 10 } = request.query;
            const offset = (page - 1) * limit;

            const tasks = await fastify.pg.query(
                'SELECT * FROM tasks ORDER BY id LIMIT $1 OFFSET $2',
                [limit, offset]
            );

            const total = await fastify.pg.query('SELECT COUNT(*) FROM tasks');

            reply.send({
                tasks: tasks.rows,
                total: total.rows[0].count,
                page,
                limit
            });
        }
    });
}

module.exports = fp(taskRoutes);