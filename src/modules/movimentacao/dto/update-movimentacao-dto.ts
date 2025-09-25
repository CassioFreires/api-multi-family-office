import z from 'zod';
import { TipoMovimentacaoSchema } from './create-movimentacao-dto.js';
import { FrequenciaSchema } from './create-movimentacao-dto.js';

export const updateMovimentacaoBodySchema = z.object({
  tipo: TipoMovimentacaoSchema.optional(),
  valor: z.number().positive('O valor deve ser um número positivo.').optional(),
  frequencia: FrequenciaSchema.optional(),
  dataDeInicio: z.coerce.date().optional(),
  dataDeFim: z.coerce.date().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para a atualização.',
}).strict();

export type UpdateMovimentacaoDTO = z.infer<typeof updateMovimentacaoBodySchema>;

// DTO para a leitura e deleção (parâmetros de rota)
export const movimentacaoParamsSchema = z.object({
  id: z.string().transform(v => parseInt(v)),
});

export type MovimentacaoParamsDTO = z.infer<typeof movimentacaoParamsSchema>;