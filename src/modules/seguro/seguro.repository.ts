import prisma from "../../config/prisma.js";
import { CreateSeguroDTO } from "./dto/create-seguro-dto.js";
import { UpdateSeguroDTO } from "./dto/update-seguro-dto.js";

export class SeguroRepository {
  async create(data: CreateSeguroDTO) {
    return await prisma.seguro.create({ data });
  }

  async findAll() {
    return await prisma.seguro.findMany();
  }

  async findById(id: number) {
    return await prisma.seguro.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateSeguroDTO) {
    return await prisma.seguro.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await prisma.seguro.delete({ where: { id } });
  }
}