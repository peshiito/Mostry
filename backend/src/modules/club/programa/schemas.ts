import { z } from 'zod';

const descripcion = z.string().trim().max(80);
const centavos = z.number().int().positive().max(10_000_000);

// Un escalón: en qué compra se habilita y qué da. El servidor es el único que
// después calcula el descuento (L4); acá solo se valida la forma.
const esquemaPremio = z.discriminatedUnion('tipo', [
  z.strictObject({
    compras: z.number().int().min(1).max(50),
    tipo: z.literal('porcentaje'),
    valor: z.number().int().min(1).max(100),
    tope: centavos.nullable(),
    descripcion: descripcion.nullable(),
  }),
  z.strictObject({
    compras: z.number().int().min(1).max(50),
    tipo: z.literal('monto'),
    valor: centavos,
    tope: z.null().optional(), // lo que devuelve el GET se puede reenviar tal cual
    descripcion: descripcion.nullable(),
  }),
  z.strictObject({
    compras: z.number().int().min(1).max(50),
    tipo: z.literal('regalo'),
    valor: z.null().optional(),
    tope: z.null().optional(),
    descripcion: descripcion.min(2),
  }),
]);
export type PremioNuevo = z.infer<typeof esquemaPremio>;

// El programa se guarda entero: datos y escalones, de menor a mayor.
export const esquemaPrograma = z.strictObject({
  nombre: z.string().trim().min(2).max(40),
  compraMinima: z.number().int().min(0).max(10_000_000),
  venceMeses: z.number().int().min(1).max(24).nullable(),
  premios: z
    .array(esquemaPremio)
    .min(1)
    .max(6)
    .refine((ps) => ps.every((p, i) => i === 0 || p.compras > ps[i - 1]!.compras), {
      message: 'Los escalones van de menor a mayor, sin repetir compras.',
    }),
});
export type ProgramaNuevo = z.infer<typeof esquemaPrograma>;

export const esquemaActivo = z.strictObject({ activo: z.boolean() });
