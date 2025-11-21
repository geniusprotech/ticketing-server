import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';
import moment from 'moment';

const prisma = new PrismaClient()

const prismaPlugin = fp(async (fastify) => {
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async () => {
        fastify.log.info('Disconnecting Prisma...')
        await prisma.$disconnect()
        fastify.log.info('Prisma disconnected cleanly ✅')
    })
});

export default prismaPlugin;

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}