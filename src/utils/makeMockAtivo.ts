import { Ativo } from '@prisma/client';
import { CreateAtivoDTO } from '../modules/ativo/dto/create-ativo-dto.js';

/**
 * Mock para o DTO usado na criação (sem id)
 */
export function makeCreateAtivoDTO(overrides: Partial<CreateAtivoDTO> = {}): CreateAtivoDTO {
    return {
        nome: 'Ativo Mock',
        valor: 1000,
        data: new Date(),
        tipo: 'Financeiro',
        simulacaoId: 123,   // Atenção: este ID precisa existir no banco na hora do teste!
        financiamento: false,
        parcelas: 12,
        taxaDeJuros: 0.05,
        valorDeEntrada: 100,
        ...overrides,
    };
}

/**
 * Mock para objeto Ativo completo (com id)
 */
export function makeMockAtivo(overrides: Partial<Ativo> = {}): Omit<Ativo, 'id'> & Partial<Pick<Ativo, 'id'>> {
    return {
        // id pode ser sobrescrito pelo override, ou omitido se for criação
        nome: 'Ativo Mock',
        tipo: 'Financeiro',
        valor: 1000,
        data: new Date(),
        simulacaoId: 123, // idem, deve existir no banco
        financiamento: false,
        parcelas: 12,
        taxaDeJuros: 0.05,
        valorDeEntrada: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}
