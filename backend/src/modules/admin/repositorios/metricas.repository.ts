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

  // Club Mostry: solo cantidades, nunca datos de nadie (Lealtad L5).
  async club() {
    const [tiendas, socios] = await Promise.all([
      db
        .selectFrom('tiendas')
        .select((eb) => eb.fn.countAll<number>().as('n'))
        .where('usaClub', '=', true)
        .executeTakeFirstOrThrow(),
      db
        .selectFrom('clientes')
        .select((eb) => eb.fn.countAll<number>().as('n'))
        .where('emailVerificadoEn', 'is not', null)
        .executeTakeFirstOrThrow(),
    ]);
    return { tiendasConClub: Number(tiendas.n), socios: Number(socios.n) };
  },

  // Lo que pagaron las tiendas eliminadas sigue contando (sus pagos se borraron).
  eliminadas: () => db.selectFrom('tiendasEliminadas').select('pagos').execute(),
};
