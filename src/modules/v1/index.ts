import { FastifyInstance } from 'fastify';
import eventRoutes from './event/routes';
import bookingRoutes from './booking/routes';
import authenticationRoutes from './auth/routes';
import uploadRoutes from './upload/routes';

export default async function registerModules(fastify: FastifyInstance) {
  await fastify.register(authenticationRoutes, { prefix: '/auths' });
  await fastify.register(eventRoutes, { prefix: '/events' });
  await fastify.register(bookingRoutes, { prefix: '/bookings' });
  await fastify.register(uploadRoutes, { prefix: '/uploads' });
  
}