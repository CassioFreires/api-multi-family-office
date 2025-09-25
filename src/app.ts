import Fastify from 'fastify';
import { simulacoesRouter } from './routers/simulacoes.js';
import ativosRouter from './routers/ativo.router.js';

const app = Fastify({
    logger: true
});


app.register(simulacoesRouter);
app.register(ativosRouter);



export default app;