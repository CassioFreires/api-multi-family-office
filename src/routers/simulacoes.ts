import Fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function simulacoesRouters(fastify:FastifyInstance, options:FastifyPluginOptions){
    fastify.get('/simulacoes', async(req, res) => {
        return {simulacoes: []}
    })
}



