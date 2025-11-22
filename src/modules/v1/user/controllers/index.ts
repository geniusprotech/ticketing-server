import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services';

export function userController(fastify: FastifyInstance) {
    const service = userService(fastify);

    const getUserProfile = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const userProfile = await service.getUserProfile(req.user.id);

            res.success(200, userProfile, 'User profile retrieved successfully!');
        } catch(err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    return {
        getUserProfile,
    }
}