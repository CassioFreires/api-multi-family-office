// src/tests/unit/ativo/ativo.repository.spec.ts

import { CreateAtivoDTO } from "../../../modules/ativo/dto/create-ativo-dto.js";
import { UpdateAtivoDTO } from "../../../modules/ativo/dto/update-ativo-dto.js";
import { jest } from '@jest/globals';
import { AtivoRepository } from "../../../modules/ativo/ativo.repository.js";
import { PrismaClient } from "@prisma/client/extension";
import { makeMockAtivo, makeCreateAtivoDTO } from "../../../utils/makeMockAtivo.js";

const prismaMock = {
    ativo: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
} as unknown as PrismaClient;

describe('AtivoRepository', () => {
    let ativoRepository: AtivoRepository;

    beforeEach(() => {
        ativoRepository = new AtivoRepository(prismaMock as any);
        jest.clearAllMocks();
    });

    describe('create()', () => {
        it('deve criar um novo ativo', async () => {
            // Usa o DTO de criação para a entrada
            const createAtivo = makeCreateAtivoDTO({
                nome: 'Novo Ativo',
                valor: 5000,
                data: new Date(),
                tipo: 'Financeiro',
                simulacaoId: 1,
                financiamento: false,
                parcelas: 12,
                taxaDeJuros: 0.05,
                valorDeEntrada: 1000,
            });

            // O resultado do mock é um objeto completo com id
            const mockResult = makeMockAtivo({ id: 1, ...createAtivo });

            prismaMock.ativo.create.mockResolvedValue(mockResult);

            const result = await ativoRepository.create(createAtivo);

            expect(prismaMock.ativo.create).toHaveBeenCalledWith({ data: createAtivo });
            expect(result).toEqual(mockResult);
        });
    });

    describe('findAll()', () => {
        it('deve retornar todos os ativos do banco de dados', async () => {
            // O mock do resultado é uma lista de objetos completos
            const mockResult = [makeMockAtivo({ nome: "Ativo 1" }), makeMockAtivo({ nome: "Ativo 2" })];
            
            prismaMock.ativo.findMany.mockResolvedValue(mockResult);

            const result = await ativoRepository.findAll();

            expect(prismaMock.ativo.findMany).toHaveBeenCalled();
            expect(result).toEqual(mockResult);
        });
    });

    describe('findById()', () => {
        it('deve retornar um ativo pelo seu ID', async () => {
            const id = 1;
            // O mock do resultado é um objeto completo
            const mockResult = makeMockAtivo({ id, nome: "Ativo Encontrado" });
            prismaMock.ativo.findUnique.mockResolvedValue(mockResult);

            const result = await ativoRepository.findById(id);

            expect(prismaMock.ativo.findUnique).toHaveBeenCalledWith({ where: { id } });
            expect(result).toEqual(mockResult);
        });

        it('deve retornar null se o ativo não for encontrado', async () => {
            const id = 999;
            prismaMock.ativo.findUnique.mockResolvedValue(null);

            const result = await ativoRepository.findById(id);

            expect(prismaMock.ativo.findUnique).toHaveBeenCalledWith({ where: { id } });
            expect(result).toBeNull();
        });
    });

    describe('update()', () => {
        it('deve atualizar um ativo e retornar os dados atualizados', async () => {
            const id = 1;
            const updateData: UpdateAtivoDTO = { nome: "Nome Atualizado" };
            // O mock do resultado é um objeto completo com a atualização
            const mockResult = makeMockAtivo({ id, ...updateData });
            prismaMock.ativo.update.mockResolvedValue(mockResult);

            const result = await ativoRepository.update(id, updateData);

            expect(prismaMock.ativo.update).toHaveBeenCalledWith({ where: { id }, data: updateData });
            expect(result).toEqual(mockResult);
        });
    });

    describe('delete()', () => {
        it('deve deletar um ativo e retornar os dados deletados', async () => {
            const id = 1;
            // O mock do resultado é um objeto completo que foi deletado
            const mockResult = makeMockAtivo({ id, nome: "Ativo Deletado" });
            prismaMock.ativo.delete.mockResolvedValue(mockResult);

            const result = await ativoRepository.delete(id);

            expect(prismaMock.ativo.delete).toHaveBeenCalledWith({ where: { id } });
            expect(result).toEqual(mockResult);
        });
    });
});