import { FastifyRequest, FastifyReply } from 'fastify';
import { SeguroService } from './seguro.service.js';
import z from 'zod';
import { createSeguroBodySchema } from './dto/create-seguro-dto.js';
import { updateSeguroBodySchema } from './dto/update-seguro-dto.js';
import { seguroParamsSchema } from './dto/read-seguro-dto.js';
import { CreateSeguroDTO } from './dto/create-seguro-dto.js';
import { UpdateSeguroDTO } from './dto/update-seguro-dto.js';
import { SeguroParamsDTO } from './dto/read-seguro-dto.js';

export class SeguroController {
  private seguroService: SeguroService;

  constructor() {
    this.seguroService = new SeguroService();
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data:CreateSeguroDTO = createSeguroBodySchema.parse(request.body);
      const seguro = await this.seguroService.createSeguro(data);
      return reply.status(201).send(seguro);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Os dados fornecidos são inválidos.',
          erros: error.issues,
        });
      }
      return reply.status(500).send({ message: 'Erro interno ao tentar criar o seguro.' });
    }
  }

  async readAll(request: FastifyRequest, reply: FastifyReply) {
    const seguros = await this.seguroService.getSeguros();
    if (!seguros || seguros.length === 0) {
      return reply.status(404).send({message:'Não existe nenhum seguro!'});
    }
    return reply.send(seguros);
  }

  async readOne(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id }:SeguroParamsDTO = seguroParamsSchema.parse(request.params);
      const seguro = await this.seguroService.getSeguroById(id);
      return reply.send(seguro);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'O ID fornecido é inválido.',
          erros: error.issues,
        });
      }
      return reply.status(404).send({ message: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id }:SeguroParamsDTO = seguroParamsSchema.parse(request.params);
      const data:UpdateSeguroDTO = updateSeguroBodySchema.parse(request.body);
      const seguro = await this.seguroService.updateSeguro(id, data);
      return reply.send(seguro);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Os dados fornecidos para atualização são inválidos.',
          erros: error.issues,
        });
      }
      return reply.status(404).send({ message: 'Seguro não encontrado para atualização.' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id }:SeguroParamsDTO = seguroParamsSchema.parse(request.params);
      await this.seguroService.deleteSeguro(id);
      return reply.status(204).send();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'O ID fornecido é inválido.',
          erros: error.issues,
        });
      }
      return reply.status(404).send({ message: 'Seguro não encontrado para deleção.' });
    }
  }
}