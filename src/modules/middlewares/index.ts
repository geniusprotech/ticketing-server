import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { JwtPayload } from 'jsonwebtoken';
import { ZodSchema } from 'zod';

export function readCookieMiddleware(fastify: FastifyInstance) {
    const verifySession = async (req: FastifyRequest, reply: FastifyReply) => {
        const token = req.cookies?.access_token;

        if (!token) {
            return reply.error('No session cookie found', 401);
        }

        req.sessionToken = token;

        try {
            // Verify JWT using fastify-jwt plugin
            const payload = fastify.jwt.verifyTokenInternal(token) as JwtPayload;

            // Fetch the user from Prisma
            const user = await fastify.prisma.user.findUnique({
                where: { id: payload.id || '' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });

            if (!user) {
                return reply.code(401).send({ message: 'Invalid session' });
            }

            req.user = user;
        } catch (err) {
            return reply.code(401).send({ message: 'Invalid or expired token' });
        }
    };

    return {
        verifySession
    }
}

export function validateData(schema: ZodSchema<any>) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const obj = req.method === 'GET' ? req.query : req.body;
            const parsedObj = schema.parse(obj);

            if (req.method === 'GET') {
                req.query = parsedObj
            } else {
                req.body = parsedObj

                req.body = schema.parse(req.body);
            }

        } catch (err: any) {
            if (err.name === "ZodError") {
                return reply.status(400).send({
                    status: false,
                    message: "Invalid request data",
                    errors: err.errors,
                });
            }
            return reply.status(500).send({ status: false, message: "Server error" });
        }
    };
}

declare module 'fastify' {
    interface FastifyRequest {
        sessionToken?: string;
        user?: any;
    }
}