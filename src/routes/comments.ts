import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply } from 'fastify';
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
            request: AuthenticatedRequest,
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

            const token = request.jwt.sign({
                sub: user.id.toString(),
                username: user.username,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 час
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
        preHandler: [fastify.authenticate],
        handler: async (
            request: AuthenticatedRequest,
            reply: FastifyReply
        ): Promise<void> => {
            reply.clearCookie('authToken');
            reply.code(204).send();
        }
    });
}

export default fp(authRoutes);