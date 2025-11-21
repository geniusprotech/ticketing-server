import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { uploadService } from '../services';

export function uploadController(fastify: FastifyInstance) {
    const service = uploadService(fastify);

    const uploadImage = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const data = await service.uploadImage(req);

            res.success(200, data, 'Upload image successfully!');
        } catch(err: any) {
            res.error(err.message, err?.code || 500);
        }
    }

    return {
        uploadImage,
    }
}