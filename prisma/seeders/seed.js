const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const moment = require('moment');
require('dotenv').config();

const prisma = new PrismaClient();

const hashPassword = (inputPassword) => {
    var salt = bcrypt.genSaltSync(Number(process.env.SALT_KEY));
    return bcrypt.hashSync(inputPassword, salt);
}

async function main() {
    await prisma.ticket.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.event.deleteMany();

    // Create admin users
    await prisma.user.createMany({
        data: [
            { name: 'Vero', email: 'vero@sjs.edu.id', password: hashPassword("vero"), role: "admin" },
            { name: 'Caca', email: 'caca@sjs.edu.id', password: hashPassword("caca"), role: "admin" },
            { name: 'Novi', email: 'novi@sjs.edu.id', password: hashPassword("novi"), role: "admin" }
        ]
    });

    // Create event
    const event = await prisma.event.create({
        data: {
            title: 'Nusantara Berdendang',
            date: moment('2025-12-06T09:00:00').toISOString(),
            location: 'Saint John School Green Lake, Function Hall 5th Floor',
            slug: 'nusantara-berdendang',
            price: 20000
        },
        select: { id: true }
    });

    console.log("Event created:", event.id);

    const rows = 18;
    const columns = 28;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const seatsData = [];
    const ticketImage = "https://assets.genmedik.com/tix/tickets";

    for (let row = 0; row < rows; row++) {
        const rowLabel = alphabet[row];

        for (let col = 1; col <= columns; col++) {
            const seat = {
                eventId: event.id,
                seatNumber: `${rowLabel}${col}`,
                rowNumber: row + 1,
                columnNumber: col,
            };

            // BOOKED seat logic
            if (['A', 'B'].includes(rowLabel) && (col > 7 && col < 22)) {
                seat.status = 'BOOKED';
            } else if (!['A', 'B'].includes(rowLabel) && col < 8) {
                seat.status = 'BOOKED';
            } else if (!['A', 'B'].includes(rowLabel) && col > 21) {
                seat.status = 'BOOKED';
            }

            seatsData.push(seat);
        }
    }

    // Insert all seats
    await prisma.seat.createMany({
        data: seatsData,
        skipDuplicates: true,
    });

    console.log(`Created ${seatsData.length} seats`);

    // Fetch all created seats
    const allSeats = await prisma.seat.findMany({
        select: { 
            id: true,
            seatNumber: true,
        }
    });

    console.log(`Preparing ${allSeats.length} tickets...`);

    // Build ticket rows
    const ticketsData = allSeats.map(seat => ({
        seatId: seat.id,
        ticketFile: `${ticketImage}/${seat.seatNumber}.png`,
    }));

    // Insert tickets
    await prisma.ticket.createMany({
        data: ticketsData,
        skipDuplicates: true,
    });

    console.log(`Created ${ticketsData.length} tickets`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
