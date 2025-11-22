import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticationService } from '../services';
import { UserInput } from '../models';

export function authenticationController(fastify: FastifyInstance) {
    const service = authenticationService(fastify);

    const login = async (req: FastifyRequest<{ Body: UserInput }>, res: FastifyReply) => {
        try {
            const token = await service.login(req.body);

            res
                .setCookie("access_token", token || '', {
                    httpOnly: true,
                    secure: fastify.config.NODE_ENV === 'development' ? false : true,
                    sameSite: "lax", // atau "none" tapi harus dengan secure: true
                    path: "/",
                    maxAge: 60 * 60 * 24 // 1 hari dalam detik
                })
                .success(200, null, 'Success login!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    const logout = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            res
                .clearCookie("access_token", {
                    path: "/",
                })
                .success(200, null, 'Success logout!');
        } catch (err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    return {
        login,
        logout,
    }
}