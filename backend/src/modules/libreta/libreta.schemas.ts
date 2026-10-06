import { z } from 'zod';
import { plataPositiva } from '../../shared/utils/esquemas.js';
import { normalizarWhatsapp } from '../../shared/utils/whatsapp.js';

export { esquemaId } from '../../shared/utils/esquemas.js';

const telefono = z
  .string()
  .max(30)
  .nullable()
  .transform((v, ctx) => {
    if (!v) return null;
    const n = normalizarWhatsapp(v);
    if (!n)
      ctx.addIssue({
        code: 'custom',
        message: 'Escribilo con código de área, sin el 15',
      });
    return n ?? z.NEVER;
  });

export const esquemaCliente = z.strictObject({
  nombre: z.string().trim().min(2).max(100),
  telefono: telefono.optional(),
});
export const esquemaEditarCliente = z
  .strictObject({
    nombre: z.string().trim().min(2).max(100).optional(),
    telefono: telefono.optional(),
    activo: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, 'No mandaste ningún cambio');

// Un pago necesita el medio (entra a caja); una deuda no mueve plata.
export const esquemaMovimientoFiado = z
  .strictObject({
    tipo: z.enum(['deuda', 'pago']),
    monto: plataPositiva,
    detalle: z.string().trim().max(200).optional(),
    medio: z.enum(['efectivo', 'transferencia']).optional(),
  })
  .refine((d) => (d.tipo === 'pago') === (d.medio !== undefined), {
    message: 'Un pago lleva medio; una deuda no',
    path: ['medio'],
  });

export const esquemaFiltrosClientes = z.strictObject({
  buscar: z.string().trim().max(100).optional(),
  estado: z.enum(['activos', 'todos']).default('activos'),
});

export const esquemaNota = z.strictObject({ texto: z.string().trim().min(1).max(1000) });

export type MovimientoFiado = z.infer<typeof esquemaMovimientoFiado>;
