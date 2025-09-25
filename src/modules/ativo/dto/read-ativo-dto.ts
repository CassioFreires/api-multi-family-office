import z from 'zod';
export const ativoParamsSchema = z.object({
  id: z.string().transform(v => parseInt(v)),
});

export type AtivoParamsDTO = z.infer<typeof ativoParamsSchema>;