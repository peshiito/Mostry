import { z } from 'zod';
import { esquemaItem } from '../../pedidos/schemaItem.js';
import { whatsapp } from '../../pedidos/schemas.js';

// Encargos 3: un encargo que le llegó por WhatsApp o en persona, cargado por el
// comerciante. Los precios los pone el servidor; la seña, si ya la cobró.
export const esquemaEncargoManual = z
  .strictObject({
    clienteNombre: z.string().trim().min(2).max(100),
    clienteWhatsapp: whatsapp,
    entrega: z.enum(['envio', 'retiro']),
    direccion: z.string().trim().min(5).max(200).optional(),
    fechaEncargo: z.iso.datetime({ offset: true }).transform((v) => new Date(v)),
    items: z
      .array(esquemaItem)
      .min(1)
      .max(50)
      .refine(
        (items) => new Set(items.map((i) => i.productoId)).size === items.length,
        'Hay productos repetidos',
      ),
    sena: z
      .strictObject({
        monto: z.int().min(1).max(1_000_000_000),
        medio: z.enum(['efectivo', 'transferencia']),
      })
      .optional(),
  })
  .refine((d) => d.entrega === 'retiro' || d.direccion, {
    message: 'Falta la dirección',
    path: ['direccion'],
  });

export type DatosEncargoManual = z.infer<typeof esquemaEncargoManual>;
