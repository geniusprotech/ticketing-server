import fp from 'fastify-plugin'

const validationErrorPrisma = fp(async (fastify) => {
    fastify.decorate('errorValidation', {
        validationError: async (error: any) => {
            if(error?.code === "P2025") {
                return {
                    code: 404,
                    message: `Data not found`
                }
            }

            return {
                code: error?.statusCode || 500,
                message: error?.message || 'Internal Server Error',
            }
        },
    })

});

export default validationErrorPrisma;

declare module 'fastify' {
    interface FastifyInstance {
        errorValidation: {
            validationError(error: any): Promise<any>
        }
    }
}