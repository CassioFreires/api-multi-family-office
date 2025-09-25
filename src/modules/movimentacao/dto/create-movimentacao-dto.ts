import { z } from 'zod';

// Schema para a frequência da movimentação
export const FrequenciaSchema = z.union([
  z.literal('Unica'),
  z.literal('Mensal'),
  z.literal('Anual')
]);

// Schema para o tipo de movimentação
export const TipoMovimentacaoSchema = z.union([
  z.literal('Entrada'),
  z.literal('Saida')
]);

// DTO para a criação de uma Movimentação (CREATE)
export const createMovimentacaoBodySchema = z.object({
  tipo: TipoMovimentacaoSchema,
  valor: z.number().positive('O valor deve ser um número positivo.'),
  frequencia: FrequenciaSchema,
  dataDeInicio: z.coerce.date(),
  dataDeFim: z.coerce.date().optional(),
  simulacaoId: z.number().int().positive('O ID da simulação deve ser um número inteiro positivo.'),
}).strict();

export type CreateMovimentacaoDTO = z.infer<typeof createMovimentacaoBodySchema>;