import { FastifyInstance } from "fastify"
import axios from "axios";
import { BookTicketDTO, GetBookingListDTO } from "../models";
import { BookingStatus, SeatStatus } from "@prisma/client";
import { paginate } from "@/utils";
import moment from "moment";

export function bookingService(fastify: FastifyInstance) {
    const reserveSeats = async (prismaClient: any, userId: string, eventId: string, seatNumbers: any[]) => {
        return prismaClient.$transaction(async (tx: any) => {
            const now = new Date();

            for (const seatNumber of seatNumbers) {
                const result = await tx.seat.updateMany({
                    where: {
                        eventId,
                        seatNumber,
                        status: 'AVAILABLE'
                    },
                    data: {
                        status: 'PENDING',
                        lockedBy: userId,
                        lockedAt: now
                    }
                });


                if (result.count === 0) {
                    throw new Error(`Seat ${seatNumber} sudah diambil orang lain`);
                }
            }

            // Create booking request
            const booking = await tx.booking.create({
                data: {
                    eventId,
                    userId,
                    seatIds: seatNumbers
                }
            });

            for (const seatNumber of seatNumbers) {
                await tx.seat.updateMany({
                    where: {
                        eventId,
                        seatNumber,
                        status: 'PENDING'
                    },
                    data: {
                        bookingId: booking.id,
                    }
                });
            }

            return booking;
        });
    }

    const bookSeat = async (req: BookTicketDTO & { slugEvent: string }) => {
        try {
            let userId = null;

            const exist = await fastify.prisma.user.findFirst({
                where: { email: req.email }
            });

            const existEvent = await fastify.prisma.event.findFirstOrThrow({
                where: { slug: req.slugEvent },
                select: {
                    id: true,
                    title: true,
                }
            });

            if (exist) {
                userId = exist.id;
            } else {
                userId = (await fastify.prisma.user.create({
                    data: {
                        name: req.name,
                        email: req.email,
                        phone: req.phone,
                    },
                    select: {
                        id: true
                    }
                })).id;
            }

            const booking = await reserveSeats(fastify.prisma, userId, existEvent.id, req.seats);

            const countBook = await fastify.prisma.booking.count();

            await fastify.prisma.booking.update({
                where: {
                    id: booking.id,
                },
                data: {
                    code: `BK-SJS-${String(countBook).padStart(6, '0')}`,
                }
            });

            fastify.mailer.sendTemplate(
                'ticketPurchase',
                {
                    eventName: existEvent?.title,
                    name: exist?.name ? exist?.name : req.name,
                    seatId: req.seats.toString(),
                    bookingUrl: `${fastify.config.BASE_URL}/events/booking`,
                    payment: {
                        bankName: 'BCA',
                        accountName: 'YAY YOHANES JAKARTA',
                        accountNumber: '3703009804'
                    },
                    supports: {
                        phone: '+62 822 2920 7974 / +62 812 1177 9742',
                        email: 'claudiagustarini@saintjohn.sch.id',
                        linkedInUrl: fastify.config.URL_LINKEDIN,
                        instagramUrl: fastify.config.URL_IG,
                    }
                },
                {
                    from: "no-reply@geniusprotech.com",
                    to: exist?.email ? exist?.email : req.email,
                    subject: "Thank you for purchasing",
                });

            return booking;
        } catch (error: any) {
            console.log(error);
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const updateTransferBooking = async (userId: string, bookingId: string, transferUrl: string) => {
        try {
            return fastify.prisma.booking.updateMany({
                where: {
                    id: bookingId,
                    userId,
                },
                data: {
                    transferReceipt: transferUrl,
                }
            });
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const getBookingPublicList = async (userId: string) => {
        try {
            const bookings = await fastify.prisma.booking.findMany({
                where: { userId },
                select: {
                    id: true,
                    code: true,
                    createdAt: true,
                    transferReceipt: true,
                    status: true,
                    event: {
                        select: {
                            title: true,
                            date: true,
                            location: true,
                            price: true,
                            slug: true,
                        }
                    },
                    seatIds: true,
                    tickets: {
                        select: {
                            id: true,
                            ticketFile: true,
                            seat: {
                                select: {
                                    seatNumber: true,
                                }
                            }
                        }
                    },
                    seats: {
                        select: {
                            seatNumber: true,
                            rowNumber: true,
                            columnNumber: true,
                            status: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return bookings;
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const updateBookingStatus = async (bookingId: string, status: string, role: string) => {
        try {
            if (role !== 'admin') throw ({ statusCode: 403, message: 'Not Authorized! ' });

            const exist = await fastify.prisma.booking.findFirst({
                where: { id: bookingId },
                include: {
                    seats: {
                        include: {
                            ticket: true
                        }
                    },
                    event: true,
                    user: true,
                }
            });

            if (!exist) throw ({ statusCode: 404, message: 'Booking not found!' });

            const bookStatus = status.toLowerCase() === 'approved'
                ? BookingStatus.APPROVED
                : BookingStatus.REJECTED;

            await fastify.prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: bookStatus,
                    approvedAt: bookStatus === BookingStatus.APPROVED ? new Date() : null,
                    rejectedAt: bookStatus === BookingStatus.REJECTED ? new Date() : null,
                }
            });

            // If Booking Accepted update seat status and add booking ID on ticket
            if (bookStatus === BookingStatus.APPROVED) {
                await fastify.prisma.seat.updateMany({
                    where: {
                        bookingId: exist.id,
                    },
                    data: {
                        status: SeatStatus.BOOKED,
                    }
                });

                await fastify.prisma.ticket.updateMany({
                    where: {
                        id: {
                            in: exist.seats.map((seat: any) => seat?.ticket?.id),
                        }
                    },
                    data: {
                        bookingId: exist.id,
                    }
                });

                fastify.mailer.sendTemplate(
                    'paymentConfirmed',
                    {
                        eventName: exist?.event?.title,
                        name: exist?.user?.name,
                        tickets: exist.seats.map((seat: any) => ({
                            seatId: seat.seatNumber,
                            ticketUrl: seat.ticket.ticketFile,
                        })),
                        supports: {
                            phone: '+62 822 2920 7974 / +62 812 1177 9742',
                            email: 'claudiagustarini@saintjohn.sch.id',
                            linkedInUrl: fastify.config.URL_LINKEDIN,
                            instagramUrl: fastify.config.URL_IG,
                        }
                    },
                    {
                        from: "no-reply@geniusprotech.com",
                        to: exist?.user?.email,
                        subject: "Payment Verified",
                    });
            } else {
                // If Booking Rejected, open seat for sale
                for (const seat of exist.seats) {
                    await fastify.prisma.seat.updateMany({
                        where: {
                            id: seat.id,
                        },
                        data: {
                            status: SeatStatus.AVAILABLE,
                            lockedBy: null,
                            lockedAt: null,
                            bookingId: null,
                        }
                    });
                }

                fastify.mailer.sendTemplate(
                    'bookingRejected',
                    {
                        eventName: exist?.event?.title,
                        name: exist?.user?.name,
                        seats: exist.seats.map((seat: any) => seat.seatNumber),
                        supports: {
                            phone: '+62 822 2920 7974 / +62 812 1177 9742',
                            email: 'claudiagustarini@saintjohn.sch.id',
                            linkedInUrl: fastify.config.URL_LINKEDIN,
                            instagramUrl: fastify.config.URL_IG,
                        }
                    },
                    {
                        from: "no-reply@geniusprotech.com",
                        to: exist?.user?.email,
                        subject: "Booking Rejected",
                    });
            }
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const getListBooking = async (req: GetBookingListDTO & { role: string }) => {

        try {
            if (req.role !== 'admin') throw ({ statusCode: 403, mesage: 'Not Authorized! ' });

            const filter: any = {
                code: {
                    contains: req.keyword || undefined,
                    mode: 'insensitive',
                },
                status: req.status === 'PENDING' ? BookingStatus.PENDING : req.status === 'APPROVED' ? BookingStatus.APPROVED : req.status === 'REJECTED' ? BookingStatus.REJECTED : undefined,
                exported: req.exported === '1' ? true : req.exported === '0' ? false : undefined,
            }

            const bookings = await fastify.prisma.booking.findMany({
                where: filter,
                include: {
                    event: true,
                    user: true,
                    seats: true,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: req.limit * (req.currentPage - 1),
                take: req.limit,
            });

            const total = await fastify.prisma.booking.count({
                where: filter,
            });

            const pagination = paginate(req.currentPage, req.limit, total);

            return {
                data: bookings,
                pagination: pagination
            };
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const updateExportedEvidence = (bookingIds: string[], role: string) => {
        if (role !== 'admin') throw ({ statusCode: 403, mesage: 'Not Authorized! ' });

        return fastify.prisma.booking.updateMany({
            where: {
                id: {
                    in: bookingIds,
                }
            },
            data: {
                exported: true,
            }
        });
    }

    const getProxyImage = async (imageUrl: string) => {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            return {
                data: response.data,
                contentType: response.headers['content-type']
            };
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const sendBulkEmailBooking = async () => {
        try {
            const bookings = await fastify.prisma.booking.findMany({
                where: {
                    status: BookingStatus.APPROVED,
                },
                include: {
                    event: true,
                    user: true,
                    seats: {
                        include: {
                            ticket: true
                        },
                    },
                },
            });

            for (const booking of bookings) {
                fastify.mailer.sendTemplate(
                    'paymentConfirmed',
                    {
                        eventName: booking?.event?.title,
                        name: booking?.user?.name,
                        tickets: booking.seats.map((seat: any) => ({
                            seatId: seat.seatNumber,
                            ticketUrl: seat.ticket.ticketFile,
                        })),
                        supports: {
                            phone: '+62 822 2920 7974 / +62 812 1177 9742',
                            email: 'claudiagustarini@saintjohn.sch.id',
                            linkedInUrl: fastify.config.URL_LINKEDIN,
                            instagramUrl: fastify.config.URL_IG,
                        }
                    },
                    {
                        from: "no-reply@geniusprotech.com",
                        to: booking?.user?.email,
                        subject: "Payment Verified",
                    });
            }
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const sendBulkEmailBookingPending = async () => {
        try {
            const bookings = await fastify.prisma.booking.findMany({
                where: {
                    status: BookingStatus.PENDING,
                    transferReceipt: null,
                },
                include: {
                    event: true,
                    user: true,
                    seats: {
                        include: {
                            ticket: true
                        },
                    },
                },
            });

            for (const booking of bookings) {
                fastify.mailer.sendTemplate(
                    'ticketPurchase',
                    {
                        eventName: booking?.event?.title,
                        name: booking?.user?.name,
                        seatId: booking.seats.map((seat: any) => seat.seatNumber),
                        bookingUrl: `${fastify.config.BASE_URL}/events/booking`,
                        payment: {
                            bankName: 'BCA',
                            accountName: 'YAY YOHANES JAKARTA',
                            accountNumber: '3703009804'
                        },
                        supports: {
                            phone: '+62 822 2920 7974 / +62 812 1177 9742',
                            email: 'claudiagustarini@saintjohn.sch.id',
                            linkedInUrl: fastify.config.URL_LINKEDIN,
                            instagramUrl: fastify.config.URL_IG,
                        }
                    },
                    {
                        from: "no-reply@geniusprotech.com",
                        to: booking?.user?.email,
                        subject: "Thank you for purchasing",
                    });
            }
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    const sendBulkEmailInvitedGuest = async (payload: any, slug: string) => {
        try {
            const event = await fastify.prisma.event.findFirst({
                where: {
                    slug,
                },
            });

            if (!event) throw ({ statusCode: 404, message: 'Event not found' });

            for (const guest of payload) {
                fastify.mailer.sendTemplate(
                    'invitedGuest',
                    {
                        eventName: event?.title,
                        seats: guest.seats.map((seat: any) => ({
                            seatId: seat,
                            seatUrl: `${fastify.config.CF_PUBLIC_DOMAIN}/tix/tickets/${seat.toUpperCase()}.png`,
                        })),
                        name: guest.name,
                        location: event?.location,
                        time: moment(event?.date).format('DD MMM YYYY, HH:mm'),
                        supports: {
                            phone: '+62 822 2920 7974 / +62 812 1177 9742',
                            email: 'claudiagustarini@saintjohn.sch.id',
                            linkedInUrl: fastify.config.URL_LINKEDIN,
                            instagramUrl: fastify.config.URL_IG,
                        }
                    },
                    {
                        from: "no-reply@geniusprotech.com",
                        to: guest.email,
                        subject: "Invited to Event",
                    });
            }
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    return {
        bookSeat,
        updateTransferBooking,
        getBookingPublicList,
        updateBookingStatus,
        getListBooking,
        updateExportedEvidence,
        getProxyImage,
        sendBulkEmailBooking,
        sendBulkEmailBookingPending,
        sendBulkEmailInvitedGuest,
    }
}