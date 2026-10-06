import { db } from '../shared/db/db.js';
import { appConCuenta } from './appConCuenta.js';
import { publico } from './publico.js';

const todaLaSemana = [0, 1, 2, 3, 4, 5, 6].map((diaSemana) => ({
  diaSemana,
  abre: '00:00',
  cierra: '24:00',
}));

// Tienda abierta siempre, con alias cargado y 3 productos (precios en centavos).
export async function tiendaLista(slug = 'dona-rosa') {
  const ctx = await appConCuenta(slug);
  await ctx.panel.put('/panel/horarios', { tramos: todaLaSemana }).expect(200);
  await db
    .updateTable('tiendas')
    .set({
      alias: 'dona.rosa.mp',
      titularAlias: 'Rosa Gómez',
      costoEnvio: 150000,
      senaPorcentaje: 30,
    })
    .where('slug', '=', slug)
    .execute();
  const crear = async (p: object) =>
    (await ctx.panel.post('/panel/productos', p).expect(201)).body.id as number;
  const productos = {
    medialuna: await crear({ nombre: 'Medialuna', precio: 35000, stock: 5 }),
    vigilante: await crear({ nombre: 'Vigilante', precio: 40000, stock: 20 }),
    rogel: await crear({
      nombre: 'Rogel',
      precio: 2800000,
      stock: 0,
      aceptaEncargo: true,
    }),
  };
  return { ...ctx, productos, comprador: publico(ctx.app, slug) };
}

const PRECIOS: Record<string, number> = {
  medialuna: 35000,
  vigilante: 40000,
  rogel: 2800000,
};

// Cuerpo de checkout con el total que vería el comprador.
export function pedido(
  productos: Record<string, number>,
  lineas: Record<string, number>,
  extra: Record<string, unknown> = {},
) {
  const items = Object.entries(lineas).map(([nombre, cantidad]) => ({
    productoId: productos[nombre]!,
    cantidad,
  }));
  const subtotal = Object.entries(lineas).reduce((s, [n, c]) => s + PRECIOS[n]! * c, 0);
  const envio = extra.entrega === 'envio' ? 150000 : 0;
  return {
    tipo: 'inmediato',
    clienteNombre: 'Ana Pérez',
    clienteWhatsapp: '11 2345-6789',
    entrega: 'retiro',
    items,
    totalEsperado: subtotal + envio,
    ...extra,
  };
}
