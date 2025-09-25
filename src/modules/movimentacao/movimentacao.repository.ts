import { Prisma } from '../../generated/prisma/index.js';
import prisma from '../../config/prisma.js';
import { CreateMovimentacaoDTO } from './dto/create-movimentacao-dto.js';
import { UpdateMovimentacaoDTO } from './dto/update-movimentacao-dto.js';

export class MovimentacaoRepository {
  async create(data: CreateMovimentacaoDTO) {
    return await prisma.movimentacao.create({ data });
  }

  async findAll() {
    return await prisma.movimentacao.findMany();
  }

  async findById(id: number) {
    return await prisma.movimentacao.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateMovimentacaoDTO) {
    return await prisma.movimentacao.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await prisma.movimentacao.delete({ where: { id } });
  }
}