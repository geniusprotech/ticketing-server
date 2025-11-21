import { buildApp } from './app';

const start = async () => {
  const app = await buildApp()
  
  try {
    await app.listen({ port: app.config.PORT, host: app.config.HOST });
    console.log(`🚀 Server running at http://${app.config.HOST}:${app.config.PORT}`);
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()