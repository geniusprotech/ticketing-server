import fp from "fastify-plugin";
import nodemailer from "nodemailer";

const mailerPlugin = fp(async function (fastify, opts: any) {
    const {
        host = "smtp-relay.brevo.com",
        port = 587,
        user,
        pass,
        templates = {}, // { welcome: (data) => `<html>...</html>` }
    } = opts;

    if (!user || !pass) {
        throw new Error("Missing Brevo SMTP credentials");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: { user, pass },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Decorate for general send
    fastify.decorate("mailer", {
        sendMail: async (options: any) => transporter.sendMail(options),
        sendTemplate: async (templateName: string, data: any, mailOptions: any) => {
            if (!templates[templateName]) {
                throw new Error(`Email template '${templateName}' not found`);
            }

            const html = templates[templateName](data);

            return transporter.sendMail({
                ...mailOptions,
                html,
            });
        },
    });
});

export default mailerPlugin;

declare module "fastify" {
    interface FastifyInstance {
        mailer: {
            sendTemplate(templateName: string, data: any, mailOptions: any): any
        }
    }
}