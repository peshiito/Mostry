import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { db } from '../../../shared/db/db.js';

export const adminDetalleRepo = {
  duenos: (tiendaId: TiendaId) =>
    db
      .selectFrom('miembrosTienda')
      .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
      .select([
        'usuarios.id',
        'usuarios.email',
        'usuarios.nombre',
        'usuarios.emailVerificadoEn',
        'miembrosTienda.rol',
      ])
      .where('miembrosTienda.tiendaId', '=', tiendaId)
      .execute(),

  // Cuántos productos cargó (uso de la herramienta). Los pedidos NO: son datos
  // del negocio del comercio.
  async conteos(tiendaId: TiendaId) {
    const productos = await db
      .selectFrom('productos')
      .select((eb) => eb.fn.countAll<number>().as('n'))
      .where('tiendaId', '=', tiendaId)
      .executeTakeFirstOrThrow();
    return { productos: Number(productos.n) };
  },

  pagos: (tiendaId: TiendaId) =>
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
