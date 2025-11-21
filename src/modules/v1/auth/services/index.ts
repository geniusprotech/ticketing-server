import { FastifyInstance } from "fastify";
import { UserInput } from "../models";


export function authenticationService(fastify: FastifyInstance) {
    const login = async (payload: UserInput) => {
        try {
            const user = await fastify.prisma.user.findFirst({
                where: {
                    email: payload.email,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    password: true,
                    phone: true,
                    role: true,
                }
            });

            if (!user) throw ({ code: 400, message: 'User not found' });

            let token = null;

            if (user.role.toLowerCase() === 'admin') {
                const isPasswordValid = await fastify.bcrypt.verifyPassword(payload.password || '', user.password || '');
                if (!isPasswordValid) throw ({ code: 400, message: 'Email or password is incorrect' });

                token = await fastify.jwt.signInternal({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                });
            } else {
                token = await fastify.jwt.signInternal({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                });
            }

            return token;
        } catch (error) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    return {
        login
    }
}