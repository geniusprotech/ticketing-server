import { FastifyInstance } from 'fastify';
import { validateData, readCookieMiddleware } from '@/modules/middlewares';
import { authenticationController } from '../controllers';
import { UserSchema, UserInput } from '../models';

export default async function authenticationRoutes(fastify: FastifyInstance) {
    const controller = authenticationController(fastify);
    const middleware = readCookieMiddleware(fastify);
  

    fastify.post<{ Body: UserInput }>('/login', { preHandler: [validateData(UserSchema)] }, controller.login);
    fastify.post('/logout', { preHandler: [middleware.verifySession] }, controller.logout);
}