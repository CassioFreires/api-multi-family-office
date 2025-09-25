import z from 'zod';
import { AtivoTipoSchema } from './create-ativo-dto.js';

export const updateAtivoBodySchema = z.object({
  nome: z.string().min(1, 'O nome do ativo é obrigatório.').optional(),
  valor: z.number().positive('O valor deve ser um número positivo.').optional(),
  data: z.coerce.date().optional(),
  tipo: AtivoTipoSchema.optional(),

  // Campos opcionais para Ativos Imobilizados
  financiamento: z.boolean().optional(),
  parcelas: z.number().int().positive().optional(),
  taxaDeJuros: z.number().positive().optional(),
  valorDeEntrada: z.number().positive().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização.',
});

export type UpdateAtivoDTO = z.infer<typeof updateAtivoBodySchema>;