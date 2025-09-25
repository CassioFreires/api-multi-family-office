import { FastifyRequest, FastifyReply } from 'fastify';
import { MovimentacaoService } from './movimentacao.service.js';
import z from 'zod';
import { CreateMovimentacaoDTO } from './dto/create-movimentacao-dto.js';
import { UpdateMovimentacaoDTO } from './dto/update-movimentacao-dto.js';
import { MovimentacaoParamsDTO } from './dto/update-movimentacao-dto.js';
import { createMovimentacaoBodySchema } from './dto/create-movimentacao-dto.js';
import { updateMovimentacaoBodySchema } from './dto/update-movimentacao-dto.js';
import { movimentacaoParamsSchema } from './dto/update-movimentacao-dto.js';

export class MovimentacaoController {
    private movimentacaoService: MovimentacaoService;

    constructor() {
        this.movimentacaoService = new MovimentacaoService();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data:CreateMovimentacaoDTO = createMovimentacaoBodySchema.parse(request.body);
            const movimentacao = await this.movimentacaoService.createMovimentacao(data);
            return reply.status(201).send(movimentacao);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'Os dados fornecidos são inválidos.',
                    erros: error.issues,
                });
            }
            return reply.status(500).send({ message: 'Erro interno ao tentar criar a movimentação.' });
        }
    }

    async readAll(request: FastifyRequest, reply: FastifyReply) {
        const movimentacoes = await this.movimentacaoService.getMovimentacoes();
        if (!movimentacoes || movimentacoes.length === 0) {
            return reply.status(404).send({message: 'Não existe nenhuma movimentação'}); 
        }
        return reply.send(movimentacoes);
    }

    async readOne(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id }:MovimentacaoParamsDTO = movimentacaoParamsSchema.parse(request.params);
            const movimentacao = await this.movimentacaoService.getMovimentacaoById(id);
            return reply.send(movimentacao);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'O ID fornecido é inválido.',
                    erros: error.issues,
                });
            }
            return reply.status(404).send({ message: 'Movimentação não encontrada.' });
        }
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id }:MovimentacaoParamsDTO = movimentacaoParamsSchema.parse(request.params);
            const data:UpdateMovimentacaoDTO = updateMovimentacaoBodySchema.parse(request.body);
            const movimentacao = await this.movimentacaoService.updateMovimentacao(id, data);
            return reply.send(movimentacao);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'Os dados fornecidos para atualização são inválidos.',
                    erros: error.issues,
                });
            }
            return reply.status(404).send({ message: 'Movimentação não encontrada para atualização.' });
        }
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id }:MovimentacaoParamsDTO = movimentacaoParamsSchema.parse(request.params);
            await this.movimentacaoService.deleteMovimentacao(id);
            return reply.status(204).send(); // No Content
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'O ID fornecido é inválido.',
                    erros: error.issues,
                });
            }
            return reply.status(404).send({ message: 'Movimentação não encontrada para deleção.' });
        }
    }
}