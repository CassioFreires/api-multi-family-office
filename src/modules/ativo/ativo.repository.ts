import { CreateAtivoDTO } from "./dto/create-ativo-dto.js";
import prisma from "../../config/prisma.js";
import { UpdateAtivoDTO } from "./dto/update-ativo-dto.js";


export class AtivoRepository {
  async create(data: CreateAtivoDTO) {
    return await prisma.ativo.create({ data });
  }

  async findAll() {
    return await prisma.ativo.findMany();
  }

  async findById(id: number) {
    return await prisma.ativo.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateAtivoDTO) {
    return await prisma.ativo.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await prisma.ativo.delete({ where: { id } });
  }
}