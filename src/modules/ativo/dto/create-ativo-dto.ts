import { z } from 'zod';

// Schema para o tipo de ativo (Financeiro ou Imobilizado)
export const AtivoTipoSchema = z.union([
  z.literal('Financeiro'),
  z.literal('Imobilizado')
]);

// 1. DTO para a criação de um Ativo
export const createAtivoBodySchema = z.object({
  nome: z.string().min(1, 'O nome do ativo é obrigatório.'),
  valor: z.number().positive('O valor deve ser um número positivo.'),
  data: z.coerce.date(),
  tipo: AtivoTipoSchema,
  simulacaoId: z.number().int().positive('O ID da simulação deve ser um número inteiro positivo.'),
  
  // Campos opcionais para Ativos Imobilizados
  financiamento: z.boolean().optional(),
  parcelas: z.number().int().positive().optional(),
  taxaDeJuros: z.number().positive().optional(),
  valorDeEntrada: z.number().positive().optional(),
});

export type CreateAtivoDTO = z.infer<typeof createAtivoBodySchema>;
