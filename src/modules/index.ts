import { FastifyInstance } from 'fastify';
import v1Routes from './v1';

export default async function registerModules(fastify: FastifyInstance) {
  await fastify.register(v1Routes, { prefix: '/v1' });
}