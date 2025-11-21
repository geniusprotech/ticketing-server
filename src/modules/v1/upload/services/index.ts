import { FastifyInstance, FastifyRequest } from "fastify";

export function uploadService(fastify: FastifyInstance) {
    const uploadImage = async (req: FastifyRequest) => {
        try {
            const data = await req.file();

            if (!data) throw({ statusCode: 400, message: 'No File Found!'})

            const uploaded = await fastify.r2.upload(data);

            return {
                url: uploaded.url,
            }
        } catch (error: any) {
            throw (await fastify.errorValidation.validationError(error));
        }
    }

    return {
        uploadImage
    }
}