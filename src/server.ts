import app from './app.js' // 'app' é a instância Fastify

const start = async () => {
    try {
        await app.listen({ port: 3000 }) // app.listen() funciona
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();