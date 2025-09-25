import { MovimentacaoRepository } from './movimentacao.repository.js';
import { CreateMovimentacaoDTO } from './dto/create-movimentacao-dto.js';
import { UpdateMovimentacaoDTO } from './dto/update-movimentacao-dto.js';

export class MovimentacaoService {
  private movimentacaoRepository: MovimentacaoRepository;

  constructor() {
    this.movimentacaoRepository = new MovimentacaoRepository();
  }

  async createMovimentacao(data: CreateMovimentacaoDTO) {
    return await this.movimentacaoRepository.create(data);
  }

  async getMovimentacoes() {
    return await this.movimentacaoRepository.findAll();
  }

  async getMovimentacaoById(id: number) {
    const movimentacao = await this.movimentacaoRepository.findById(id);
    if (!movimentacao) {
      throw new Error('Movimentação não encontrada.');
    }
    return movimentacao;
  }

  async updateMovimentacao(id: number, data: UpdateMovimentacaoDTO) {
    return await this.movimentacaoRepository.update(id, data);
  }

  async deleteMovimentacao(id: number) {
    return await this.movimentacaoRepository.delete(id);
  }
}