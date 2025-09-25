import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';

import { SimulacoesController } from '../modules/simulacao/simulacao.controller.js';

export async function simulacoesRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Inicializa o Controller
  const controller = new SimulacoesController();

  // Rota para criar uma nova simulação (CREATE)
  fastify.post('/simulacoes', {
    handler: controller.create.bind(controller),
  });

  // Rota para buscar todas as simulações (READ ALL)
  fastify.get('/simulacoes', {
    handler: controller.readAll.bind(controller),
  });

  // Rota para buscar uma simulação por ID (READ ONE)
  fastify.get('/simulacoes/:id', {
    handler: controller.readOne.bind(controller),
  });

  // Rota para atualizar uma simulação (UPDATE)
  fastify.patch('/simulacoes/:id', {
    handler: controller.update.bind(controller),
  });

  // Rota para deletar uma simulação (DELETE)
  fastify.delete('/simulacoes/:id', {
    handler: controller.delete.bind(controller),
  });
}