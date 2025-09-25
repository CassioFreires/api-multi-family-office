import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { MovimentacaoController } from '../modules/movimentacao/movimentacao.controller.js';


export async function movimentacaoRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new MovimentacaoController();

  // CREATE: Cria uma nova movimentação
  fastify.post('/movimentacoes', {
    handler: controller.create.bind(controller),
  });

  // READ ALL: Busca todas as movimentações
  fastify.get('/movimentacoes', {
    handler: controller.readAll.bind(controller),
  });

  // READ ONE: Busca uma movimentação por ID
  fastify.get('/movimentacoes/:id', {
    handler: controller.readOne.bind(controller),
  });

  // UPDATE: Atualiza uma movimentação
  fastify.put('/movimentacoes/:id', {
    handler: controller.update.bind(controller),
  });

  // DELETE: Deleta uma movimentação
  fastify.delete('/movimentacoes/:id', {
    handler: controller.delete.bind(controller),
  });
}