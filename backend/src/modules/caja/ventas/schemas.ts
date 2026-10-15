import { z } from 'zod';

// Venta rápida: del navegador solo vienen ids, cantidades y el monto suelto. El
// servidor pone los precios (nunca confía en los que vería la pantalla).
export const esquemaVenta = z
  .strictObject({
    items: z
      .array(
        z.strictObject({
          productoId: z.int().positive(),
          cantidad: z.int().min(1).max(999),
        }),
      )
      .max(50)
      .default([]),
    suelto: z
      .strictObject({
        monto: z.int().min(1).max(1_000_000_000),
        concepto: z.string().trim().max(80).optional(),
      })
      .optional(),
    medio: z.enum(['efectivo', 'transferencia']),
    // Cliente del Club (Lealtad L3): la ficha firmada que dio /panel/club/identificar.
    fichaClub: z.string().max(200).optional(),
    premio: z.int().min(1).max(50).optional(), // escalón a usar; el servidor descuenta
  })
  .refine((d) => d.items.length > 0 || d.suelto, 'La venta está vacía');

export const esquemaDia = z.strictObject({ dia: z.iso.date().optional() });
export type DatosVenta = z.infer<typeof esquemaVenta>;
