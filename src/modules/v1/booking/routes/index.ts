import { FastifyInstance } from 'fastify';
import { readCookieMiddleware, validateData } from '@/modules/middlewares';
import { bookingController } from '../controllers';
import { bookTicketSchema, getBookingListSchema } from '../models';

export default async function bookingRoutes(fastify: FastifyInstance) {
    const controller = bookingController(fastify);
    const middleware = readCookieMiddleware(fastify);

    fastify.get('/dashboard', { preHandler: [middleware.verifySession, validateData(getBookingListSchema)] }, controller.getListBooking);
    fastify.get('/image-proxy', { preHandler: [middleware.verifySession] }, controller.getImageProxy);
    fastify.get('/', { preHandler: [middleware.verifySession] }, controller.getBookingPublicList);
    fastify.post('/send-bulk-email', { preHandler: [middleware.verifySession] }, controller.sendBulkEmailBooking);
    fastify.post('/send-bulk-email-pending', { preHandler: [middleware.verifySession] }, controller.sendBulkEmailBookingPending);
    fastify.post<{ Params: { slug: string } }>(`/send-bulk-email-invited-guest/:slug`, { preHandler: [middleware.verifySession] }, controller.sendBulkEmailBookingInvitedGuest);
    fastify.post('/', { preHandler: [validateData(bookTicketSchema)] }, controller.bookSeats);
    fastify.put('/export', { preHandler: [middleware.verifySession] }, controller.updateExportedBooking);
    fastify.put<{ Params: { id: string } }>('/status/:id', { preHandler: [middleware.verifySession] }, controller.updateBookingStatus);
    fastify.put<{ Params: { id: string } }>('/:id', { preHandler: [middleware.verifySession] }, controller.updateTransferReceipt);
}