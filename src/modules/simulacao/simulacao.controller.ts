import { FastifyRequest, FastifyReply } from 'fastify';
import { SimulacoesService } from './simulacao.service.js';
import { z } from 'zod'; // Import the Zod library
import { CreateSimulacaoDto } from './dto/create-simulacao.dto.js';
import { UpdateSimulacaoDTO } from './dto/update-simulacao.dto.js';
import { createSimulacaoSchema } from './dto/create-simulacao.dto.js';
import { updateSimulacaoBodySchema } from './dto/update-simulacao.dto.js';
import { SimulacaoParamsDTO, simulacaoParamsSchema } from './dto/read-simulacao.dto.js';

export class SimulacoesController {
  private simulacoesService: SimulacoesService;

  constructor() {
    this.simulacoesService = new SimulacoesService();
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data:CreateSimulacaoDto = createSimulacaoSchema.parse(request.body);
      
      const simulacao = await this.simulacoesService.createSimulation(data);
      return reply.status(201).send(simulacao);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Falha na validação.',
          errors: error.issues,
        });
      }
      return reply.status(500).send({ message: 'Erro interno de servidor' + error.message});
    }
  }

  async readAll(request: FastifyRequest, reply: FastifyReply) {
    const simulacoes = await this.simulacoesService.getSimulations();
    

    if (!simulacoes || simulacoes.length === 0) {
      return reply.status(404).send({message: 'Não existe simulações'});
    }
    
    return reply.send(simulacoes);
  }

  async readOne(request: FastifyRequest<{ Params: SimulacaoParamsDTO }>, reply: FastifyReply) {
    const paramsValidation = simulacaoParamsSchema.safeParse(request.params);
    if (!paramsValidation.success) {
      return reply.status(400).send({ message: 'Invalid ID.' });
    }
    
    const { id } = paramsValidation.data;

    try {
      const simulacao = await this.simulacoesService.getSimulationById(id);
      return reply.send(simulacao);
    } catch (error: any) {
      return reply.status(404).send({ message: 'Erro interto ao tentar buscar a simulação através do ID' + error.message});
    }
  }

  async update(request: FastifyRequest<{ Params: SimulacaoParamsDTO, Body: UpdateSimulacaoDTO }>, reply: FastifyReply) {

    const paramsValidation = simulacaoParamsSchema.safeParse(request.params);
    const bodyValidation = updateSimulacaoBodySchema.safeParse(request.body);
    
    if (!paramsValidation.success || !bodyValidation.success) {
      return reply.status(400).send({
        message: 'Campo inválido.',
        errors: {
          params: paramsValidation.success ? null : paramsValidation.error.issues,
          body: bodyValidation.success ? null : bodyValidation.error.issues,
        },
      });
    }

    const { id } = paramsValidation.data;
    const data = bodyValidation.data;
    const simulacao = await this.simulacoesService.updateSimulation(id, data);
    return reply.send(simulacao);
  }

  async delete(request: FastifyRequest<{ Params: SimulacaoParamsDTO }>, reply: FastifyReply) {
    const paramsValidation = simulacaoParamsSchema.safeParse(request.params);
    if (!paramsValidation.success) {
      return reply.status(400).send({ message: 'ID inválido.' });
    }
    
    const { id } = paramsValidation.data;

    try {
      await this.simulacoesService.deleteSimulation(id);
      return reply.status(204).send({message: 'Simulação deletada com sucesso'}); // No Content
    } catch (error: any) {
      return reply.status(404).send({ message: error.message });
    }
  }
}