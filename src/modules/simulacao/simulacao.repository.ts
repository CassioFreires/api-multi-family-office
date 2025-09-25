import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";
import { CreateSimulacaoDto } from "./dto/create-simulacao.dto.js";
import { UpdateSimulacaoDTO } from "./dto/update-simulacao.dto.js";

export class SimulacoesRepository {
  async create(data: CreateSimulacaoDto) {
    return await prisma.simulacao.create({ data });
  }

  async findAll() {
    return await prisma.simulacao.findMany();
  }

  async findById(id: number) {
    return await prisma.simulacao.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateSimulacaoDTO) {
    return await prisma.simulacao.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await prisma.simulacao.delete({ where: { id } });
  }

  // NOVO: Método para buscar a simulação com todos os seus dados relacionados
  async findByIdWithRelations(id: number) {
    return await prisma.simulacao.findUnique({
      where: { id },
      include: {
        ativos: true,
        movimentacoes: true,
        seguros: true
      }
    });
  }

  // NOVO: Método para duplicar a simulação e suas relações
  async duplicate(simulacaoOriginal: any) {
    // Inicia uma transação para garantir que todas as operações sejam concluídas ou nenhuma seja
    return await prisma.$transaction(async (prisma) => {
      // 1. Cria a nova simulação
      const novaSimulacao = await prisma.simulacao.create({
        data: {
          nome: `${simulacaoOriginal.nome} (Cópia)`,
          dataDeInicio: simulacaoOriginal.dataDeInicio,
          taxaReal: simulacaoOriginal.taxaReal,
          status: simulacaoOriginal.status,
          isSituacaoAtual: false,
          isLegacy: false
        }
      });

      // 2. Cria os novos ativos
      const novosAtivos = simulacaoOriginal.ativos.map((ativo: any) => ({
        ...ativo,
        id: undefined, // Remove o ID para que o banco de dados gere um novo
        simulacaoId: novaSimulacao.id,
      }));
      await prisma.ativo.createMany({ data: novosAtivos });

      // 3. Cria as novas movimentações
      const novasMovimentacoes = simulacaoOriginal.movimentacoes.map((mov: any) => ({
        ...mov,
        id: undefined,
        simulacaoId: novaSimulacao.id,
      }));
      await prisma.movimentacao.createMany({ data: novasMovimentacoes });

      // 4. Cria os novos seguros
      const novosSeguros = simulacaoOriginal.seguros.map((seguro: any) => ({
        ...seguro,
        id: undefined,
        simulacaoId: novaSimulacao.id,
      }));
      await prisma.seguro.createMany({ data: novosSeguros });

      return novaSimulacao;
    });
  }
}