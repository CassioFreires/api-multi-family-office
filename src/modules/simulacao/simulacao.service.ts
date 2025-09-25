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
}