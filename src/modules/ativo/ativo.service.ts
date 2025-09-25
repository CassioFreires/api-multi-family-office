import { AtivoRepository } from './ativo.repository.js';
import { CreateAtivoDTO } from './dto/create-ativo-dto.js';
import { UpdateAtivoDTO } from './dto/update-ativo-dto.js';

export class AtivoService {
  private ativoRepository: AtivoRepository;

  constructor() {
    this.ativoRepository = new AtivoRepository();
  }

  async createAtivo(data: CreateAtivoDTO) {
    return await this.ativoRepository.create(data);
  }

  async getAtivos() {
    return await this.ativoRepository.findAll();
  }

  async getAtivoById(id: number) {
    const ativo = await this.ativoRepository.findById(id);
    if (!ativo) {
      throw new Error('Ativo não encontrado.');
    }
    return ativo;
  }

  async updateAtivo(id: number, data: UpdateAtivoDTO) {
    return await this.ativoRepository.update(id, data);
  }

  async deleteAtivo(id: number) {
    return await this.ativoRepository.delete(id);
  }
}