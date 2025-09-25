// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NUM_SIMULACOES = 3;
const NUM_ATIVOS_POR_SIMULACAO = 5;
const NUM_MOVS_POR_SIMULACAO = 6;
const NUM_SEGUROS_POR_SIMULACAO = 2;

async function main() {
  console.log('Iniciando o processo de seeder...');

  // Limpar tabelas existentes para garantir um estado limpo a cada execução
  await prisma.ativoHistorico.deleteMany();
  await prisma.ativo.deleteMany();
  await prisma.movimentacao.deleteMany();
  await prisma.seguro.deleteMany();
  await prisma.simulacao.deleteMany();
  console.log('Tabelas limpas. Iniciando a criação de dados...');

  // --- 1. Criar Múltiplas Simulações ---
  const simulacoes = [];
  for (let i = 0; i < NUM_SIMULACOES; i++) {
    const simulacao = await prisma.simulacao.create({
      data: {
        nome: `Plano Financeiro ${i + 1}`,
        dataDeInicio: new Date(`2024-0${i + 1}-01T00:00:00Z`),
        taxaReal: 3.5 + i * 0.5,
        status: i === 0 ? 'Vivo' : (i === 1 ? 'Morto' : 'Invalido'),
        isSituacaoAtual: i === 0,
        isLegacy: i > 0,
      },
    });
    simulacoes.push(simulacao);
    console.log(`Simulação '${simulacao.nome}' criada com ID: ${simulacao.id}`);
  }

  // --- 2. Criar Ativos para cada Simulação ---
  for (const simulacao of simulacoes) {
    for (let i = 0; i < NUM_ATIVOS_POR_SIMULACAO; i++) {
      const tipoAtivo = i % 2 === 0 ? 'Financeiro' : 'Imobilizado';
      await prisma.ativo.create({
        data: {
          nome: `${tipoAtivo} ${i + 1}`,
          valor: 50000 + i * 10000,
          data: new Date(),
          tipo: tipoAtivo,
          simulacaoId: simulacao.id,
          // Adiciona dados de financiamento para ativos imobilizados
          ...(tipoAtivo === 'Imobilizado' && {
            financiamento: true,
            parcelas: 180,
            taxaDeJuros: 7.0,
            valorDeEntrada: 10000,
          }),
        },
      });
      console.log(`Ativo '${i + 1}' criado para a simulação ${simulacao.id}`);
    }
  }

  // --- 3. Criar Movimentações para cada Simulação ---
  for (const simulacao of simulacoes) {
    // Entrada Mensal
    await prisma.movimentacao.create({
      data: {
        tipo: 'Entrada',
        valor: 5000,
        frequencia: 'Mensal',
        dataDeInicio: new Date('2024-01-01T00:00:00Z'),
        dataDeFim: new Date('2050-01-01T00:00:00Z'),
        simulacaoId: simulacao.id,
      },
    });

    // Saída Anual
    await prisma.movimentacao.create({
      data: {
        tipo: 'Saida',
        valor: 1200,
        frequencia: 'Anual',
        dataDeInicio: new Date('2024-01-01T00:00:00Z'),
        dataDeFim: new Date('2060-01-01T00:00:00Z'),
        simulacaoId: simulacao.id,
      },
    });

    // Saída Única (Despesa de Viagem)
    await prisma.movimentacao.create({
      data: {
        tipo: 'Saida',
        valor: 5000,
        frequencia: 'Unica',
        dataDeInicio: new Date('2025-05-15T00:00:00Z'),
        simulacaoId: simulacao.id,
      },
    });
    console.log(`Movimentações criadas para a simulação ${simulacao.id}`);
  }
  
  // --- 4. Criar Seguros para cada Simulação ---
  for (const simulacao of simulacoes) {
      await prisma.seguro.create({
          data: {
              nome: "Seguro de Vida",
              dataDeInicio: new Date("2024-01-01T00:00:00Z"),
              duracaoMeses: 120,
              premioMensal: 250.00,
              valorSegurado: 500000.00,
              simulacaoId: simulacao.id
          }
      });
      console.log(`Seguros criados para a simulação ${simulacao.id}`);
  }

  console.log('Seeder concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });