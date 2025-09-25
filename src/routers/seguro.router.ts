import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SeguroController } from '../modules/seguro/seguro.controller.js';


export async function seguroRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const controller = new SeguroController();

  // CREATE: Cria um novo seguro
  fastify.post('/seguros', {
    handler: controller.create.bind(controller),
  });

  // READ ALL: Busca todos os seguros
  fastify.get('/seguros', {
    handler: controller.readAll.bind(controller),
  });

  // READ ONE: Busca um seguro por ID
  fastify.get('/seguros/:id', {
    handler: controller.readOne.bind(controller),
  });

  // UPDATE: Atualiza um seguro
  fastify.patch('/seguros/:id', {
    handler: controller.update.bind(controller),
  });

  // DELETE: Deleta um seguro
  fastify.delete('/seguros/:id', {
    handler: controller.delete.bind(controller),
  });
}