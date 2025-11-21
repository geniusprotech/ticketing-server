import fp from "fastify-plugin"
import bcrypt from "bcryptjs";

const bcryptPlugin = fp(async (fastify) => {
    const saltRounds = fastify.config.SALT_KEY

    fastify.decorate("bcrypt", {
        hashingPassword: async (password: string) => {
            return await bcrypt.hash(password, Number(saltRounds))
        },
        verifyPassword: async (password: string, hashed: string) => {
            return await bcrypt.compare(password, hashed)
        }
    })
})

export default bcryptPlugin;

declare module "fastify" {
    interface FastifyInstance {
        bcrypt: {
            hashingPassword(password: string): Promise<string>
            verifyPassword(password: string, hashed: string): Promise<boolean>
        }
    }
}