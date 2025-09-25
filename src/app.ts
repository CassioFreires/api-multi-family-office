import Fastify from 'fastify';
import { simulacoesRouter } from './routers/simulacoes.js';
import ativosRouter from './routers/ativo.router.js';
import { movimentacaoRouter } from './routers/movimentacao.router.js';

const app = Fastify({
    logger: true
});


app.register(simulacoesRouter);
app.register(ativosRouter);
app.register(movimentacaoRouter);



export default app;