import z from 'zod';

export const seguroParamsSchema = z.object({
  id: z.string().transform(v => parseInt(v)),
});

export type SeguroParamsDTO = z.infer<typeof seguroParamsSchema>;