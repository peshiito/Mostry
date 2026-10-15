import { z } from 'zod';

// Un renglón del checkout: del navegador se toman el id y la cantidad (los
// precios los pone el servidor) y, en Encargos 2, cómo lo quiere el comprador.
export const esquemaItem = z.strictObject({
  productoId: z.int().positive(),
  cantidad: z.int().min(1).max(99),
  personalizacion: z
    .string()
    .trim()
    .max(500)
    .transform((v) => v || undefined)
    .optional(),
});
