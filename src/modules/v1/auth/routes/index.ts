import { FastifyInstance } from 'fastify';
import { validateData } from '@/modules/middlewares';
import { authenticationController } from '../controllers';
import { UserSchema, UserInput } from '../models';

export default async function authenticationRoutes(fastify: FastifyInstance) {
    const controller = authenticationController(fastify);

    fastify.post<{ Body: UserInput }>('/login', { preHandler: [validateData(UserSchema)] }, controller.login);
}