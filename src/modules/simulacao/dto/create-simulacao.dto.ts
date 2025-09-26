import { z } from "zod";

export const createSimulacaoSchema = z.object({
  nome: z.string().min(3),
  dataDeInicio: z.coerce.date(),
  taxaReal: z.number().default(0.04),
  status: z.enum(["Vivo", "Morto", "Invalido"]).default("Vivo"),
  createdAt:z.date().optional()
});

export type CreateSimulacaoDto = z.infer<typeof createSimulacaoSchema>;
