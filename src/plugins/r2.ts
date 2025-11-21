import fp from "fastify-plugin"
import aws from "aws-sdk"

interface CloudflareR2Options {
    accountId: string
    accessKeyId: string
    secretAccessKey: string
    bucketName: string
    publicDomain: string
}

const cloudflareR2Plugin = fp<CloudflareR2Options>(async (fastify, opts) => {
    const {
        accountId,
        accessKeyId,
        secretAccessKey,
        bucketName,
        publicDomain
    } = opts;

    const s3 = new aws.S3({
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        accessKeyId,
        secretAccessKey,
        region: "auto",
        signatureVersion: "v4",
    });

    fastify.decorate("r2", {
        upload: async (file: any) => {
            const buffer = await file.toBuffer();
            const fileName = `${Date.now()}-${file.filename.replace(/ /g, '_')}`;

            await s3
                .putObject({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: buffer,
                    ContentType: file.mimetype,
                    ACL: "public-read",
                })
                .promise();

            return {
                fileName,
                url: `${publicDomain}/${fastify.config.CF_PATH}/${fileName}`
            };
        }
    });
})

export default cloudflareR2Plugin;

declare module "fastify" {
    interface FastifyInstance {
        r2: {
            upload(file: any): Promise<{
                fileName: string
                url: string
            }>
        }
    }
}
