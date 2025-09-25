import { FastifyRequest, FastifyReply } from 'fastify';
import { AtivoService } from './ativo.service.js';
import z from 'zod';

import { createAtivoBodySchema, CreateAtivoDTO } from './dto/create-ativo-dto.js';
import { updateAtivoBodySchema, UpdateAtivoDTO } from './dto/update-ativo-dto.js';
import { ativoParamsSchema, AtivoParamsDTO } from './dto/read-ativo-dto.js';

export class AtivoController {
    private ativoService: AtivoService;

    constructor() {
        this.ativoService = new AtivoService();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data:CreateAtivoDTO = createAtivoBodySchema.parse(request.body);
            const ativo = await this.ativoService.createAtivo(data);
            return reply.status(201).send(ativo);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'Os dados fornecidos são inválidos.',
                    erros: error.issues,
                });
            }
            return reply.status(500).send({ message: 'Erro interno ao tentar criar o ativo.' + error.message });
        }
    }

    async readAll(request: FastifyRequest, reply: FastifyReply) {
        const ativos = await this.ativoService.getAtivos();
        if (!ativos || ativos.length === 0) {
            return reply.status(404).send({message: 'Não existe nenhum ativo!'});
        }
        return reply.send(ativos);
    }

    async readOne(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id }:AtivoParamsDTO = ativoParamsSchema.parse(request.params);
            const ativo = await this.ativoService.getAtivoById(id);
            return reply.send(ativo);
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
            const { id }:AtivoParamsDTO = ativoParamsSchema.parse(request.params);
            const data:UpdateAtivoDTO = updateAtivoBodySchema.parse(request.body);
            const ativo = await this.ativoService.updateAtivo(id, data);
            return reply.send(ativo);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'Os dados fornecidos para atualização são inválidos.',
                    erros: error.issues,
                });
            }
            return reply.status(404).send({ message: 'Ativo não encontrado para atualização.' });
        }
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id }:AtivoParamsDTO = ativoParamsSchema.parse(request.params);
            await this.ativoService.deleteAtivo(id);
            return reply.status(204).send(); // No Content
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'O ID fornecido é inválido.',
                    erros: error.issues,
                });
            }
            return reply.status(404).send({ message: 'Ativo não encontrado para deleção.' });
        }
    }
}