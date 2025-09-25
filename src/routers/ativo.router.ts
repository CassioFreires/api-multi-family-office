import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AtivoController } from '../modules/ativo/ativo.controller.js';


function ativosRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new AtivoController();

  fastify.post('/ativos', {
    handler: controller.create.bind(controller),
  });

  fastify.get('/ativos', {
    handler: controller.readAll.bind(controller),
  });

  fastify.get('/ativos/:id', {
    handler: controller.readOne.bind(controller),
  });

  fastify.patch('/ativos/:id', {
    handler: controller.update.bind(controller),
  });

  fastify.delete('/ativos/:id', {
    handler: controller.delete.bind(controller),
  });
}
export default ativosRouter;