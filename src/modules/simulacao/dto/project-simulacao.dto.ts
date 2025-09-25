import z from 'zod';

export const projectBodySchema = z.object({
  status: z.union([z.literal('Vivo'), z.literal('Morto'), z.literal('Invalido')]),
});