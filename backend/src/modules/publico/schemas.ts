import { z } from 'zod';

export const esquemaId = z.coerce.number().int().positive();

export const esquemaFiltrosPublicos = z.strictObject({
  categoriaId: esquemaId.optional(),
  buscar: z.string().trim().max(100).optional(),
  destacados: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  pagina: z.coerce.number().int().min(1).max(500).default(1),
});
