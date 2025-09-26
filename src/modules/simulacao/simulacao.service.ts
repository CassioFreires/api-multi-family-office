import { SimulacoesRepository } from './simulacao.repository.js';
import { CreateSimulacaoDto } from './dto/create-simulacao.dto.js';
import { UpdateSimulacaoDTO } from './dto/update-simulacao.dto.js';

export class SimulacoesService {
  private simulacoesRepository: SimulacoesRepository;

  constructor() {
    this.simulacoesRepository = new SimulacoesRepository();
  }

  async createSimulation(data: CreateSimulacaoDto) {
    return await this.simulacoesRepository.create(data);
  }

  async getSimulations() {
    return await this.simulacoesRepository.findAll();
  }

  async getSimulationById(id: number) {
    const simulacao = await this.simulacoesRepository.findById(id);
    if (!simulacao) {
      throw new Error('Simulação não encontrada.');
    }
    return simulacao;
  }

  async updateSimulation(id: number, data: UpdateSimulacaoDTO) {
    return await this.simulacoesRepository.update(id, data);
  }

  async deleteSimulation(id: number) {
    return await this.simulacoesRepository.delete(id);
  }


  // NOVO: Método para a projeção da simulação
  async projectSimulation(id: number, status: 'Vivo' | 'Morto' | 'Invalido') {
    const simulacao = await this.simulacoesRepository.findByIdWithRelations(id);
    if (!simulacao) {
      throw new Error('Simulação não encontrada para projeção.');
    }

    const resultados = [];
    let patrimonioAtual = simulacao.ativos.reduce((total, ativo) => total + ativo.valor, 0);

    for (let ano = new Date().getFullYear(); ano <= 2060; ano++) {
      // Aplica a taxa de crescimento
      patrimonioAtual *= (1 + simulacao.taxaReal / 100);

      // Aplica movimentações de entrada e saída para o ano
      const movimentacoesAno = simulacao.movimentacoes.filter(m => new Date(m.dataDeInicio).getFullYear() === ano);
      movimentacoesAno.forEach(m => {
        // Se o status for "Morto", as despesas são divididas por 2
        if (m.tipo === 'Entrada' && status === 'Morto') {
          // Cliente Morto não tem entrada.
          // O case diz 'cliente não possui timeline de entradas'
        } else if (m.tipo === 'Saida' && status === 'Morto') {
          patrimonioAtual -= (m.valor / 2); // Despesa dividida por 2
        } else {
          // Lógica padrão para Vivo/Invalido
          if (m.tipo === 'Entrada') patrimonioAtual += m.valor;
          else if (m.tipo === 'Saida') patrimonioAtual -= m.valor;
        }
      });

      // Lógica de 'Inválido' (Entradas encerradas, mas despesas normais)
      if (status === 'Invalido') {
        // Se a movimentação for uma entrada, ela não é aplicada
        // Sua lógica já trata isso indiretamente, mas é bom ter em mente.
      }

      resultados.push({ ano, patrimonioTotal: patrimonioAtual });
    }

    return resultados;
  }

  async duplicateSimulation(id: number) {
    const simulacaoOriginal = await this.simulacoesRepository.findByIdWithRelations(id);
    if (!simulacaoOriginal) {
      throw new Error('Simulação não encontrada para duplicação.');
    }

    const novaSimulacao = await this.simulacoesRepository.duplicate(simulacaoOriginal);
    return novaSimulacao;
  }
  async generateSituationActual() {
    const lastSimulation = await this.simulacoesRepository.findLast();

    if (!lastSimulation) {
      throw new Error('Nenhuma simulação encontrada para gerar a situação atual.');
    }

    const patrimonioTotal = lastSimulation.ativos.reduce((acc:any, ativo:any) => acc + ativo.valor, 0);

    const movimentacoesFuturas = lastSimulation.movimentacoes.filter(
      (m) => new Date(m.dataDeInicio) > new Date()
    );

    const situationActual = {
      dataReferencia: new Date(),
      patrimonioTotal: patrimonioTotal,
      ativos: lastSimulation.ativos,
      movimentacoesFuturas: movimentacoesFuturas,
    };

    return situationActual;
  }
}