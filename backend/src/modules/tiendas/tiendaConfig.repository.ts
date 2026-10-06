import type { TiendaId } from '../../shared/db/tiendaId.js';
import type { Updateable } from 'kysely';
import { db } from '../../shared/db/db.js';
import type { TiendasTabla } from '../../shared/db/tipos/tiendas.js';

const columnasConfig = [
  'id',
  'slug',
  'nombre',
  'frase',
  'logoClave',
  'paleta',
  'alias',
  'titularAlias',
  'whatsapp',
  'direccion',
  'pausada',
  'plazoComprobanteHoras',
  'plazoSenaHoras',
  'anticipacionEncargoHoras',
  'senaPorcentaje',
  'costoEnvio',
  'aceptaEnvio',
  'aceptaRetiro',
  'zonaEnvio',
] as const;

// Toda consulta recibe el tiendaId (la tienda resuelta por el Origin).
export const tiendaConfigRepo = {
  buscar: (tiendaId: TiendaId) =>
    db
      .selectFrom('tiendas')
      .select(columnasConfig)
      .where('id', '=', tiendaId)
      .executeTakeFirstOrThrow(),

  actualizar: (tiendaId: TiendaId, cambios: Updateable<TiendasTabla>) =>
    db.updateTable('tiendas').set(cambios).where('id', '=', tiendaId).execute(),

  suscripcion: (tiendaId: TiendaId) =>
    db
      .selectFrom('tiendas')
      .select(['estado', 'pruebaHasta', 'planHasta', 'suspendidaManual'])
      .where('id', '=', tiendaId)
      .executeTakeFirstOrThrow(),

  emailsDeDuenos: (tiendaId: TiendaId) =>
    db
      .selectFrom('miembrosTienda')
      .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
      .select('usuarios.email')
      .where('miembrosTienda.tiendaId', '=', tiendaId)
      .where('miembrosTienda.rol', '=', 'dueno')
      .execute(),
};
