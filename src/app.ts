import Fastify from 'fastify';
import { simulacoesRouter } from './routers/simulacoes.js';

const app = Fastify({
    logger: true
});


app.register(simulacoesRouter);



export default app;