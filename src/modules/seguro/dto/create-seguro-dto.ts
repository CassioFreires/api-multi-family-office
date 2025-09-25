import { z } from 'zod';

export const createSeguroBodySchema = z.object({
  nome: z.string().min(1, 'O nome do seguro é obrigatório.'),
  dataDeInicio: z.coerce.date(),
  duracaoMeses: z.number().int().positive('A duração deve ser um número inteiro positivo.'),
  premioMensal: z.number().positive('O prêmio mensal deve ser um valor positivo.'),
  valorSegurado: z.number().positive('O valor segurado deve ser um valor positivo.'),
  simulacaoId: z.number().int().positive('O ID da simulação deve ser um número inteiro positivo.'),
}).strict();

export type CreateSeguroDTO = z.infer<typeof createSeguroBodySchema>;

