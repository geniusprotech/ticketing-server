import { FastifyInstance } from "fastify";

export function eventService(fastify: FastifyInstance) {
    const getAllEvents = async (role: string) => {
        try {
            if(role.toLowerCase() === 'member') throw({ statusCode: 403, message: 'Not Authorized!'});

            const event = await fastify.prisma.event.findMany({
                select: {
                    id: true,
                    title: true,
                    date: true,
                    location: true,
                    price: true,
                }
            });

            return event;
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const getEventPublicDetail = async (slug: string) => {
        try {
            const event = await fastify.prisma.event.findFirst({
                where: { slug: slug },
                select: {
                    id: true,
                    title: true,
                    date: true,
                    location: true,
                    price: true,
                    seats: {
                        select: {
                            seatNumber: true,
                            rowNumber: true,
                            columnNumber: true,
                            status: true,
                            lockedBy: true,
                        }
                    }
                }
            });

            return event;
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    return {
        getAllEvents,
        getEventPublicDetail,
    }
}