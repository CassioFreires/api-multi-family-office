import { PrismaClient } from '@prisma/client';
import { AtivoRepository } from '../../../modules/ativo/ativo.repository.js';
import { AtivoService } from '../../../modules/ativo/ativo.service.js';
import { makeMockAtivo, makeCreateAtivoDTO } from '../../../utils/makeMockAtivo.js'; // importei o DTO também
import env from 'dotenv';

env.config();

const prismaTest = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST,
    },
  },
});

describe('Ativo Service Integration Tests', () => {
  let ativoRepository: AtivoRepository;
  let ativoService: AtivoService;
  let simulacaoId: number;

  beforeAll(async () => {
    ativoRepository = new AtivoRepository(prismaTest as any);
    ativoService = new AtivoService(ativoRepository as any);
    await prismaTest.$connect();
  });

  beforeEach(async () => {
    await prismaTest.ativo.deleteMany({});
    await prismaTest.simulacao.deleteMany({});

    const simulacao = await prismaTest.simulacao.create({
      data: {
        nome: 'Simulação Teste',
        dataDeInicio: new Date(),
        taxaReal: 1.5,
        status: 'Vivo',
        isSituacaoAtual: true,
        isLegacy: false,
      },
    });
    simulacaoId = simulacao.id;
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it('deve criar e retornar um novo ativo, persistindo-o no banco de dados', async () => {
    // Use o DTO sem id para criar
    const createData = makeCreateAtivoDTO({ nome: 'Ação Teste', simulacaoId });

    const novoAtivo = await ativoService.createAtivo(createData as any);

    expect(novoAtivo).toHaveProperty('id');
    expect(novoAtivo.nome).toBe('Ação Teste');

    const ativoNoBanco = await prismaTest.ativo.findUnique({ where: { id: novoAtivo.id } });
    expect(ativoNoBanco).toEqual(expect.objectContaining({
      id: novoAtivo.id,
      nome: 'Ação Teste',
      valor: createData.valor,
    }));
  });

  it('deve retornar todos os ativos do banco de dados', async () => {
    // Para criar direto no DB use o mock completo, sem id definido (vai gerar automaticamente)
    await prismaTest.ativo.create({ data: makeMockAtivo({ nome: 'Ativo A', simulacaoId }) });
    await prismaTest.ativo.create({ data: makeMockAtivo({ nome: 'Ativo B', simulacaoId }) });

    const ativos = await ativoService.getAtivos();

    expect(ativos).toHaveLength(2);
    expect(ativos[0].nome).toBe('Ativo A');
    expect(ativos[1].nome).toBe('Ativo B');
  });

  it('deve atualizar um ativo existente no banco de dados', async () => {
    const ativoInicial = await prismaTest.ativo.create({ data: makeMockAtivo({ nome: 'Ativo Antigo', simulacaoId }) });
    const updateData = { nome: 'Ativo Novo' };

    const ativoAtualizado = await ativoService.updateAtivo(ativoInicial.id, updateData);

    expect(ativoAtualizado.nome).toBe('Ativo Novo');

    const ativoNoBanco = await prismaTest.ativo.findUnique({ where: { id: ativoInicial.id } });
    expect(ativoNoBanco?.nome).toBe('Ativo Novo');
  });

  it('deve deletar um ativo do banco de dados', async () => {
    const ativoParaDeletar = await prismaTest.ativo.create({ data: makeMockAtivo({ nome: 'Ativo para Deletar', simulacaoId }) });

    const resultadoDeletado = await ativoService.deleteAtivo(ativoParaDeletar.id);

    expect(resultadoDeletado.id).toBe(ativoParaDeletar.id);

    const ativoNoBanco = await prismaTest.ativo.findUnique({ where: { id: ativoParaDeletar.id } });
    expect(ativoNoBanco).toBeNull();
  });
});
