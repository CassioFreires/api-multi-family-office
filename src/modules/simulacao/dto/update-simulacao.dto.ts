import {z} from 'zod';

export const updateSimulacaoBodySchema = z.object({
  nome: z.string().min(3).optional(),
  dataDeInicio: z.coerce.date().optional(),
  taxaReal: z.number().positive().optional(),
  status: z.string().optional(),
});

export type UpdateSimulacaoDTO = z.infer<typeof updateSimulacaoBodySchema>;