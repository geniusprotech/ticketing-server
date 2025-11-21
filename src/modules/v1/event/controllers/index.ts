import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eventService } from '../services';

export function eventController(fastify: FastifyInstance) {
    const service = eventService(fastify);

    const getAllEvent = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const events = await service.getAllEvents(req.user.role);

            res.success(200, events, 'Events retrieved successfully!');
        } catch(err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const getEventPublicDetail = async (req: FastifyRequest<{ Params: { slug: string} }>, res: FastifyReply) => {
        try {
            const events = await service.getEventPublicDetail(req.params.slug);

            res.success(200, events, 'Event detail retrieved successfully!');
        } catch(err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    return {
        getAllEvent,
        getEventPublicDetail,
    }
}