import { FastifyInstance } from 'fastify';
import { readCookieMiddleware, validateData } from '@/modules/middlewares';
import { bookingController } from '../controllers';
import { bookTicketSchema } from '../models';

export default async function bookingRoutes(fastify: FastifyInstance) {
    const controller = bookingController(fastify);
    const middleware = readCookieMiddleware(fastify);

    fastify.get('/', { preHandler: [middleware.verifySession] }, controller.getBookingPublicList);
    fastify.post('/', { preHandler: [validateData(bookTicketSchema)] }, controller.bookSeats);
    fastify.put<{ Params: { id: string } }>('/status/:id', { preHandler: [middleware.verifySession] }, controller.updateBookingStatus);
    fastify.put<{ Params: { id: string } }>('/:id', { preHandler: [middleware.verifySession] }, controller.updateTransferReceipt);
}