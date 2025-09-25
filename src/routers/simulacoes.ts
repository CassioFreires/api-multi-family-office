import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';

// O nome da função de plugin deve ser claro
export async function simulacoesRouter(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get('/simulacoes', async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    return reply.send({data:[]})
  });
}