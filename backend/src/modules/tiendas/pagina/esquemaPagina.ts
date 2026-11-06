import { z } from 'zod';
import { esquemaBloque } from './esquemaBloques.js';

export const MAX_BLOQUES = 40;
export const MAX_BYTES_PAGINA = 64 * 1024;

// Ajustes de toda la página: carrito sí o no (sin carrito se pide por WhatsApp),
// buscador y qué muestra la tarjeta de producto.
const esquemaAjustes = z.strictObject({
  carrito: z.boolean(),
  buscador: z.boolean(),
  tarjeta: z.strictObject({
    botones: z
      .array(z.enum(['agregar', 'ver', 'whatsapp']))
      .max(2)
      .refine((b) => new Set(b).size === b.length, 'Botón repetido'),
    categoria: z.boolean(),
    estrellas: z.boolean(),
  }),
});

// La página de inicio de la tienda ("Armá tu página"): un documento de bloques.
export const esquemaPagina = z
  .strictObject({
    version: z.literal(1),
    ajustes: esquemaAjustes,
    bloques: z.array(esquemaBloque).max(MAX_BLOQUES),
  })
  .refine(
    (p) => new Set(p.bloques.map((b) => b.id)).size === p.bloques.length,
    'Hay dos bloques con el mismo id',
  )
  .refine((p) => JSON.stringify(p).length <= MAX_BYTES_PAGINA, 'La página es muy grande');

export type DocumentoPagina = z.infer<typeof esquemaPagina>;
