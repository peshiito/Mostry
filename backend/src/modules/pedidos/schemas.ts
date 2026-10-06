import { z } from 'zod';
import { esLinkMapsValido } from '../../shared/utils/linkMaps.js';
import { normalizarWhatsapp } from '../../shared/utils/whatsapp.js';

const idBody = z.int().positive();
const whatsapp = z
  .string()
  .max(30)
  .transform((v, ctx) => {
    const n = normalizarWhatsapp(v);
    if (!n)
      ctx.addIssue({
        code: 'custom',
        message: 'Escribí tu WhatsApp con código de área, sin el 15',
      });
    return n ?? z.NEVER;
  });

// Checkout: del navegador se toman ids y cantidades; los precios los pone el servidor.
export const esquemaCheckout = z
  .strictObject({
    tipo: z.enum(['inmediato', 'encargo']),
    clienteNombre: z.string().trim().min(2).max(100),
    clienteWhatsapp: whatsapp,
    entrega: z.enum(['envio', 'retiro']),
    direccion: z.string().trim().min(5).max(200).optional(),
    linkMaps: z
      .string()
      .trim()
      .refine(esLinkMapsValido, 'Pegá el link que te da Google Maps')
      .optional(),
    fechaEncargo: z.iso
      .datetime({ offset: true })
      .transform((v) => new Date(v))
      .optional(),
    items: z
      .array(z.strictObject({ productoId: idBody, cantidad: z.int().min(1).max(99) }))
      .min(1)
      .max(50)
      .refine(
        (items) => new Set(items.map((i) => i.productoId)).size === items.length,
        'Hay productos repetidos',
      ),
    // Lo que el comprador vio: si no coincide con lo recalculado, se le avisa.
    totalEsperado: z.int().min(0),
  })
  .refine((d) => d.entrega === 'retiro' || d.direccion, {
    message: 'Falta la dirección',
    path: ['direccion'],
  })
  .refine((d) => (d.tipo === 'encargo') === (d.fechaEncargo !== undefined), {
    message: 'Un encargo necesita fecha y hora (y un pedido inmediato no)',
    path: ['fechaEncargo'],
  });

export type DatosCheckout = z.infer<typeof esquemaCheckout>;

// 256 bits en base64url = 43 caracteres.
export const esquemaToken = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
