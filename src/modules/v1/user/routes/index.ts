import { FastifyInstance } from 'fastify';
import { userController } from '../controllers';
import { readCookieMiddleware } from '@/modules/middlewares';

export default async function userRoutes(fastify: FastifyInstance) {
  const controller = userController(fastify);
  const middleware = readCookieMiddleware(fastify);

  fastify.get('/', { preHandler: [middleware.verifySession] }, controller.getUserProfile);
}