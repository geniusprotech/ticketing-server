import { FastifyInstance } from "fastify"
import { BookTicketDTO } from "../models";
import { BookingStatus, SeatStatus } from "@prisma/client";

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
                for(const seat of exist.seats) {
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

    return {
        bookSeat,
        updateTransferBooking,
        getBookingPublicList,
        updateBookingStatus,
    }
}