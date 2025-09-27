import { CreateAtivoDTO } from "./dto/create-ativo-dto.js";
import prisma from "../../config/prisma.js";
import { UpdateAtivoDTO } from "./dto/update-ativo-dto.js";
import { PrismaClient } from "@prisma/client/extension";


export class AtivoRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance ?? prisma;
  }

  async create(data: CreateAtivoDTO) {
    return await this.prisma.ativo.create({ data });
  }

  async findAll() {
    return await this.prisma.ativo.findMany(); 
  }

  async findById(id: number) {
    return await this.prisma.ativo.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateAtivoDTO) {
    return await this.prisma.ativo.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await this.prisma.ativo.delete({ where: { id } });
  }
}