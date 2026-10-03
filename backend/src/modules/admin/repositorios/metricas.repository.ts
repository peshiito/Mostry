import { db } from '../../../shared/db/db.js';

const contarDesde = (tabla: 'tiendas' | 'pedidos', desde: Date) =>
  db
    .selectFrom(tabla)
    .select((eb) => eb.fn.countAll<number>().as('n'))
    .where('creadoEn', '>=', desde)
    .executeTakeFirstOrThrow();

export const metricasRepo = {
  fechasDeTodas: () =>
    db
      .selectFrom('tiendas')
      .select(['estado', 'pruebaHasta', 'planHasta', 'suspendidaManual'])
      .execute(),

  tiendasNuevas: async (desde: Date) => Number((await contarDesde('tiendas', desde)).n),

  pedidosDesde: async (desde: Date) => Number((await contarDesde('pedidos', desde)).n),

  async cobradoDesde(desde: string) {
    const fila = await db
      .selectFrom('pagosSuscripcion')
      .select((eb) => [
        eb.fn.sum<number>('monto').as('total'),
        eb.fn.countAll<number>().as('pagos'),
      ])
      .where('pagadoEn', '>=', desde)
      .executeTakeFirstOrThrow();
    return { total: Number(fila.total ?? 0), pagos: Number(fila.pagos) };
  },
};
