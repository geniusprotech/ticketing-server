import Fastify from 'fastify'
import env from "@fastify/env"
import cookie from '@fastify/cookie';
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { Type, Static } from "@sinclair/typebox"

import registerModules from './modules';
import prismaPlugin from './plugins/prisma';
import responsePlugin from './plugins/response';
import bcryptPlugin from './plugins/bcrypt';
import jwtPlugin from './plugins/jwt';
import mailerPlugin from './plugins/mailer';
import validationErrorPrisma from './plugins/validation';
import { emailTemplates } from './utils/email';
import cloudflareR2Plugin from './plugins/r2';

const schema = Type.Object({
    NODE_ENV: Type.String({ default: 'development' }),
    HOST: Type.String({ default: 'localhost' }),
    PORT: Type.Number({ default: 3000 }),
    DATABASE_URL: Type.String(),
    JWT_SECRET_INTERNAL: Type.String(),
    COOKIE_SECRET: Type.String(),
    SALT_KEY: Type.String(),
    ORIGIN_ALLOWED: Type.String(),
    BASE_URL: Type.String(),
    URL_LINKEDIN: Type.String(),
    URL_IG: Type.String(),
    CF_ACCOUNT_ID: Type.String(),
    CF_ACCESS_KEY: Type.String(),
    CF_SECRET_KEY: Type.String(),
    CF_BUCKET: Type.String(),
    CF_PUBLIC_DOMAIN: Type.String(),
    CF_PATH: Type.String(),
    EMAIL_SMTP_HOST: Type.String(),
    EMAIL_SMTP_PORT: Type.String(),
    EMAIL_SMTP_USERNAME: Type.String(),
    EMAIL_SMTP_PASSWORD: Type.String(),
})

type EnvSchema = Static<typeof schema>

export async function buildApp() {
    const app = Fastify({ logger: true })

    // Upload Env
    await app.register(env, {
        dotenv: true,
        schema,
    });

    app.register(cors, {
        origin: [app.config.ORIGIN_ALLOWED],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, 
        exposedHeaders: ['set-cookie'],
    });

    await app.register(multipart, {
        attachFieldsToBody: false,
        limits: {
            fileSize: 50 * 1024 * 1024
        }
    });

    app.register(cloudflareR2Plugin, {
        accountId: app.config.CF_ACCOUNT_ID,
        accessKeyId: app.config.CF_ACCESS_KEY,
        secretAccessKey: app.config.CF_SECRET_KEY,
        bucketName: app.config.CF_BUCKET,
        publicDomain: app.config.CF_PUBLIC_DOMAIN
    })

    await app.register(cookie, {
        secret: app.config.COOKIE_SECRET,
        parseOptions: {},
    })

    // Plugins
    app.register(mailerPlugin, {
        host: app.config.EMAIL_SMTP_HOST,
        port: Number(app.config.EMAIL_SMTP_PORT),
        user: app.config.EMAIL_SMTP_USERNAME,
        pass: app.config.EMAIL_SMTP_PASSWORD,
        templates: emailTemplates,
    });
    app.register(prismaPlugin);
    app.register(responsePlugin);
    app.register(bcryptPlugin);
    app.register(jwtPlugin)
    app.register(validationErrorPrisma);

    // Modules
    app.register(registerModules)

    return app
}

declare module "fastify" {
    interface FastifyInstance {
        config: EnvSchema
    }
}