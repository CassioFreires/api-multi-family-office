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
}