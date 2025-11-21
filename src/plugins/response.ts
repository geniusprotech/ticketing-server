import fp from "fastify-plugin"

const responsePlugin = fp(async (fastify) => {
  fastify.decorateReply("success", function (statusCode: number, data: any, message = "Success") {
    return this.code(statusCode).send({
      status: true,
      message,
      data,
    })
  })

  fastify.decorateReply("error", function (message = "Error", statusCode = 500, errors?: any) {
    return this.code(statusCode).send({
      status: false,
      message,
      errors,
    })
  })
})

export default responsePlugin;

// Extend types for TypeScript
declare module "fastify" {
  interface FastifyReply {
    success: (statusCode: number, data: any, message?: string) => FastifyReply
    error: (message?: string, statusCode?: number, errors?: any) => FastifyReply
  }
}