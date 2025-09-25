import { SeguroRepository } from './seguro.repository.js';
import { CreateSeguroDTO } from './dto/create-seguro-dto.js';
import { UpdateSeguroDTO } from './dto/update-seguro-dto.js';

export class SeguroService {
  private seguroRepository: SeguroRepository;

  constructor() {
    this.seguroRepository = new SeguroRepository();
  }

  async createSeguro(data: CreateSeguroDTO) {
    return await this.seguroRepository.create(data);
  }

  async getSeguros() {
    return await this.seguroRepository.findAll();
  }

  async getSeguroById(id: number) {
    const seguro = await this.seguroRepository.findById(id);
    if (!seguro) {
      throw new Error('Seguro não encontrado.');
    }
    return seguro;
  }

  async updateSeguro(id: number, data: UpdateSeguroDTO) {
    return await this.seguroRepository.update(id, data);
  }

  async deleteSeguro(id: number) {
    return await this.seguroRepository.delete(id);
  }
}