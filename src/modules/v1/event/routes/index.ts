import { FastifyInstance } from 'fastify';
import { readCookieMiddleware, validateData } from '@/modules/middlewares';
import { eventController } from '../controllers';

export default async function eventRoutes(fastify: FastifyInstance) {
  const controller = eventController(fastify);
  const middleware = readCookieMiddleware(fastify);

  fastify.get('/', { preHandler: [middleware.verifySession] }, controller.getAllEvent);
  fastify.get<{ Params: { slug: string} }>('/:slug', controller.getEventPublicDetail);
}