import { FastifyInstance } from "fastify";

export function userService(fastify: FastifyInstance) {
    const getUserProfile = async (userId: string) => {
        try {
            const user = await fastify.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    name: true,
                    email: true,
                    role: true,
                }
            });

            if (!user) {
                throw ({ message: 'User not found', statusCode: 404, });
            }

            return user;
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    return {
        getUserProfile,
    }
}