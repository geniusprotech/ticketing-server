import { FastifyInstance } from 'fastify';
import { readCookieMiddleware, validateData } from '@/modules/middlewares';
import { uploadController } from '../controllers';

export default async function uploadRoutes(fastify: FastifyInstance) {
  const controller = uploadController(fastify);
  const middleware = readCookieMiddleware(fastify);

  fastify.post('/image', { preHandler: [middleware.verifySession] }, controller.uploadImage);
}