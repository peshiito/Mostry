import { z } from 'zod';
import { plataPositiva } from '../../shared/utils/esquemas.js';
import { enArgentina } from '../../shared/utils/horaArgentina.js';

export const esquemaId = z.coerce.number().int().positive();
const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((v) => v || null)
    .optional();

export const esquemaProveedor = z.strictObject({
  nombre: z.string().trim().min(2).max(100),
  contacto: textoOpcional(150),
});
export const esquemaEditarProveedor = z
  .strictObject({
    nombre: z.string().trim().min(2).max(100).optional(),
    contacto: textoOpcional(150),
    activo: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, 'No mandaste ningún cambio');

export const esquemaGasto = z.strictObject({
  tipo: z.enum(['gasto', 'inversion']),
  monto: plataPositiva,
  medio: z.enum(['efectivo', 'transferencia']),
  proveedorId: z.int().positive().optional(),
  detalle: textoOpcional(200),
});

const hoy = () => enArgentina(new Date()).fecha;
export const esquemaFiltrosGastos = z.strictObject({
  desde: z.iso.date().default(hoy),
  hasta: z.iso.date().default(hoy),
  tipo: z.enum(['gasto', 'inversion']).optional(),
  proveedores: z.enum(['activos', 'todos']).optional(),
});

export type DatosGasto = z.infer<typeof esquemaGasto>;
