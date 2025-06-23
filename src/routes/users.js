const fp = require('fastify-plugin');

async function userRoutes(fastify, opts) {
    fastify.get('/users', {
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
                        users: { type: 'array', items: { $ref: 'user.json#' } },
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

            const users = await fastify.pg.query(
                'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
                [limit, offset]
            );

            const total = await fastify.pg.query('SELECT COUNT(*) FROM users');

            reply.send({
                users: users.rows,
                total: total.rows[0].count,
                page,
                limit
            });
        }
    });

    // Регистрация нового пользователя
    fastify.post('/users', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'email', 'password', 'role'],
                properties: {
                    username: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    role: { type: 'string', enum: ['admin', 'interviewer', 'user'] }
                }
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        user: { $ref: 'user.json#' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { username, email, password, role } = request.body;

            const hashedPassword = await fastify.bcrypt.hash(password, 10);

            const result = await fastify.pg.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
                [username, email, hashedPassword, role]
            );

            reply.code(201).send({ user: result.rows[0] });
        }
    });
}

module.exports = fp(userRoutes);