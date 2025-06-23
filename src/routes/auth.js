const fp = require('fastify-plugin');

async function authRoutes(fastify, opts) {
    fastify.post('/auth/login', {
        schema: {
            body: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        user: { $ref: 'user.json#' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const { username, password } = request.body;
            const user =  {
                id: 1,
                username: username,
                email: "john@example.com",
                role: "user",
                rating: 4.5
            }

            const token = fastify.jwt.sign({
                sub: user.id,
                role: user.role
            });

            reply.send({ token, user: user.rows[0] });
        }
    });

    fastify.post('/auth/logout', {
        schema: {
            security: [{ bearerAuth: [] }],
            response: {
                204: {
                    description: true
                }
            }
        },
        handler: async (request, reply) => {
            reply.clearCookie('authToken');
            reply.code(204).send();
        }
    });
}

module.exports = fp(authRoutes);