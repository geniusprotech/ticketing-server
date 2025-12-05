import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { bookingService } from '../services';
import { BookTicketDTO, GetBookingListDTO } from '../models';

export function bookingController(fastify: FastifyInstance) {
    const service = bookingService(fastify);

    const bookSeats = async (req: FastifyRequest, res: FastifyReply) => {
        const body = req.body as BookTicketDTO;

        try {
            const events = await service.bookSeat(body);

            res.success(200, events, 'Book seat successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const getBookingPublicList = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const events = await service.getBookingPublicList(req.user.id);

            res.success(200, events, 'Retrieved booking list successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const updateTransferReceipt = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
        const body = req.body as { receiptUrl: string };
        const id = req.params.id;

        try {
            const events = await service.updateTransferBooking(req.user.id, id, body.receiptUrl);

            res.success(200, events, 'Retrieved booking list successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const updateBookingStatus = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
        const body = req.body as { status: string };
        const id = req.params.id;

        try {
            const events = await service.updateBookingStatus(id, body.status, req.user.role);

            res.success(200, events, 'Update booking status successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const getListBooking = async (req: FastifyRequest, res: FastifyReply) => {
        const query = req.query as GetBookingListDTO;

        try {
            const events = await service.getListBooking({
                ...query,
                role: req.user.role,
            });

            res.success(200, events, 'Get bookings successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const updateExportedBooking = async (req: FastifyRequest, res: FastifyReply) => {
        const body = req.body as { ids: string[] }

        try {
            const events = await service.updateExportedEvidence(body.ids, req.user.role);

            res.success(200, events, 'Get bookings successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const getImageProxy = async (req: FastifyRequest, res: FastifyReply) => {
        const query = req.query as { url: string };

        try {
            const events = await service.getProxyImage(query.url);

            res.success(200, events, 'Get proxy image successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const sendBulkEmailBooking = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const events = await service.sendBulkEmailBooking();

            res.success(200, events, 'Send bulk email booking successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const sendBulkEmailBookingPending = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const events = await service.sendBulkEmailBookingPending();

            res.success(200, events, 'Send bulk email booking pending successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const sendBulkEmailBookingInvitedGuest = async (req: FastifyRequest<{ Params: { slug: string } }>, res: FastifyReply) => {
        const payload = req.body as { name: string, email: string, seats: string[] }[];
        const slug = req.params.slug;

        try {
            const events = await service.sendBulkEmailInvitedGuest(payload, slug);

            res.success(200, events, 'Send bulk email booking invited guest successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const sendBulkEmailBookingVvipGuest = async (req: FastifyRequest<{ Params: { slug: string } }>, res: FastifyReply) => {
        const payload = req.body as { name: string, email: string, seats: string[] }[];
        const slug = req.params.slug;

        try {
            const events = await service.sendBulkEmailVvipGuest(payload, slug);

            res.success(200, events, 'Send bulk email booking vvip guest successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const sendReminderBooking = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const events = await service.sendRemiderGuest();

            res.success(200, events, 'Send reminder booking successfully!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    return {
        bookSeats,
        updateBookingStatus,
        updateTransferReceipt,
        getBookingPublicList,
        getListBooking,
        updateExportedBooking,
        getImageProxy,
        sendBulkEmailBooking,
        sendBulkEmailBookingPending,
        sendBulkEmailBookingInvitedGuest,
        sendBulkEmailBookingVvipGuest,
        sendReminderBooking,
    }
}