import z from 'zod';

export const updateSeguroBodySchema = z.object({
  nome: z.string().min(1, 'O nome do seguro é obrigatório.').optional(),
  dataDeInicio: z.coerce.date().optional(),
  duracaoMeses: z.number().int().positive().optional(),
  premioMensal: z.number().positive().optional(),
  valorSegurado: z.number().positive().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para a atualização.',
}).strict();

export type UpdateSeguroDTO = z.infer<typeof updateSeguroBodySchema>;