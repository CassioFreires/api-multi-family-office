import Fastify from 'fastify';
import { simulacoesRouters } from './routers/simulacoes.js';

const app = Fastify({
    logger: true
});


app.register(simulacoesRouters);



export default app;