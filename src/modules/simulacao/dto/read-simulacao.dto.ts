import {z} from 'zod'

export const simulacaoParamsSchema = z.object({
  id: z.string().transform(v => parseInt(v)),
});

export type SimulacaoParamsDTO = z.infer<typeof simulacaoParamsSchema>;