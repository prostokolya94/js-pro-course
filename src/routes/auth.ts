import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { LoginBody, LoginResponse } from "../types/AuthTypes";
import { User } from "../types/UserTypes";

async function authRoutes(fastify: FastifyInstance, opts: unknown) {
    fastify.post<{
        Body: LoginBody;
        Reply: LoginResponse;
    }>('/auth/login', {
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
        handler: async (
            request: FastifyRequest,
            reply: FastifyReply
        ): Promise<LoginResponse> => {
            const { username, password } = request.body;

            const user: User = {
                id: 1,
                username,
                email: "john@example.com",
                role: "user",
                rating: 4.5
            };

            const token = fastify.jwt.sign({
                sub: user.id,
                role: user.role
            });

            return {
                token,
                user
            };
        }
    });

    fastify.post<{
        Reply: void;
    }>('/auth/logout', {
        schema: {
            security: [{ bearerAuth: [] }],
            response: {
                204: {
                    description: true
                }
            }
        },
        handler: async (
            request: FastifyRequest,
            reply: FastifyReply
        ): Promise<void> => {
            reply.clearCookie('authToken');
            reply.code(204).send();
        }
    });
}

export default fp(authRoutes);