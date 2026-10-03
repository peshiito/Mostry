import { db } from '../../../shared/db/db.js';

export const adminDetalleRepo = {
  duenos: (tiendaId: number) =>
    db
      .selectFrom('miembrosTienda')
      .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
      .select([
        'usuarios.id',
        'usuarios.email',
        'usuarios.nombre',
        'usuarios.emailVerificadoEn',
        'usuarios.totpActivadoEn',
        'miembrosTienda.rol',
      ])
      .where('miembrosTienda.tiendaId', '=', tiendaId)
      .execute(),

  async conteos(tiendaId: number) {
    const contar = (tabla: 'productos' | 'pedidos') =>
      db
        .selectFrom(tabla)
        .select((eb) => eb.fn.countAll<number>().as('n'))
        .where('tiendaId', '=', tiendaId)
        .executeTakeFirstOrThrow();
    const [productos, pedidos] = await Promise.all([
      contar('productos'),
      contar('pedidos'),
    ]);
    return { productos: Number(productos.n), pedidos: Number(pedidos.n) };
  },

  pagos: (tiendaId: number) =>
    db
      .selectFrom('pagosSuscripcion')
      .innerJoin('usuarios', 'usuarios.id', 'pagosSuscripcion.registradoPor')
      .select([
        'pagosSuscripcion.id',
        'pagosSuscripcion.monto',
        'pagosSuscripcion.pagadoEn',
        'pagosSuscripcion.periodoDesde',
        'pagosSuscripcion.periodoHasta',
        'pagosSuscripcion.nota',
        'usuarios.email as registradoPor',
      ])
      .where('pagosSuscripcion.tiendaId', '=', tiendaId)
      .orderBy('pagosSuscripcion.id', 'desc')
      .limit(24)
      .execute(),
};
