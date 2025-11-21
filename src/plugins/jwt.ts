import fp from "fastify-plugin"
import jwt from "jsonwebtoken";

const jwtPlugin = fp(async (fastify) => {
    const keyInternal = fastify.config.JWT_SECRET_INTERNAL;

    fastify.decorate("jwt", {
        signInternal: async (payload: any) => {
            return jwt.sign(payload, keyInternal || '', {
                expiresIn: '24h',
            });
        },
        verifyTokenInternal: (token: string) => {
            return jwt.verify(token, keyInternal || '');
        },
    })
});

export default jwtPlugin;

declare module "fastify" {
    interface FastifyInstance {
        jwt: {
            signInternal(payload: any): Promise<string>
            verifyTokenInternal(token: string): string | jwt.JwtPayload
        }
    }
}