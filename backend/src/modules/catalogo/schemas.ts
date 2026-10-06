import { z } from 'zod';

// Ids en la URL o el query llegan como texto: se convierten. En el body JSON
// tienen que ser enteros de verdad (true o "3" no se aceptan).
export const esquemaId = z.coerce.number().int().positive();
export const idBody = z.int().positive();

export const esquemaCategoria = z.strictObject({
  nombre: z.string().trim().min(2).max(60),
});
// Plata en centavos. strictObject: tiendaId, stockReservado, etc. no se aceptan.
const camposProducto = {
  nombre: z.string().trim().min(2).max(100),
  descripcion: z
    .string()
    .trim()
    .max(2000)
    .nullable()
    .transform((v) => v || null)
    .optional(),
  precio: z.int().min(1).max(1_000_000_000),
  stock: z.int().min(0).max(1_000_000),
  stockMinimo: z.int().min(0).max(1_000_000).optional(),
  categoriaId: idBody.nullable().optional(),
  destacado: z.boolean().optional(),
  aceptaEncargo: z.boolean().optional(),
  agotado: z.boolean().optional(),
  activo: z.boolean().optional(),
};

export const esquemaNuevoProducto = z.strictObject(camposProducto);

// Para cambiar el stock hay que mandar el stock que se vio al abrir el formulario:
// si mientras tanto se aprobó un pedido, no se pisa la venta.
export const esquemaEditarProducto = z
  .strictObject({ ...camposProducto, stockAnterior: z.int().min(0).max(1_000_000) })
  .partial()
  .refine((d) => Object.keys(d).length > 0, 'No mandaste ningún cambio')
  .refine((d) => (d.stock === undefined) === (d.stockAnterior === undefined), {
    message: 'Para cambiar el stock mandá también stockAnterior',
    path: ['stockAnterior'],
  });

const booleano = z.enum(['true', 'false']).transform((v) => v === 'true');
export const esquemaFiltros = z.strictObject({
  buscar: z.string().trim().max(100).optional(),
  categoriaId: z.union([z.literal('sin'), esquemaId]).optional(),
  estado: z.enum(['activos', 'inactivos', 'todos']).default('activos'),
  stockBajo: booleano.optional(),
  pagina: z.coerce.number().int().min(1).max(1000).default(1),
});

export type DatosProducto = z.infer<typeof esquemaNuevoProducto>;
export type CambiosProducto = z.infer<typeof esquemaEditarProducto>;
export type FiltrosProductos = z.infer<typeof esquemaFiltros>;
