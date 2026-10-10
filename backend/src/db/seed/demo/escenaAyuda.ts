import { sql } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Sesion } from './sesion.js';

// Reportes (uno resuelto con respuesta y uno nuevo), un acceso de soporte ya
// vencido con lo que hizo Mostry, y Heladería del Parque a punto de vencer.
export async function escenaAyuda(
  rosa: Sesion,
  admin: Sesion,
  tiendaId: TiendaId,
  producto: number,
) {
  const viejo = await rosa.post('/panel/reportes', {
    pantalla: 'productos',
    descripcion: 'No me deja subir la foto de la torta, dice que el archivo no va.',
  });
  await admin.patch(`/admin/reportes/${viejo.id}`, {
    estado: 'resuelto',
    respuesta: 'Era un HEIC del iPhone: sacala como JPG y anda. ¡Gracias por avisar!',
  });
  await rosa.post('/panel/reportes', {
    pantalla: 'caja',
    descripcion: 'Al cerrar la caja me dio una diferencia que no entiendo.',
  });

  await rosa.post('/panel/soporte/acceso');
  await admin.patch(`/admin/soporte/${tiendaId}/productos/${producto}`, {
    destacado: true,
  });
  await db
    .updateTable('accesosSoporte')
    .set({
      creadoEn: sql`NOW() - INTERVAL 1 DAY`,
      venceEn: sql`NOW() - INTERVAL 23 HOUR`,
    })
    .where('tiendaId', '=', tiendaId)
    .execute();

  await db
    .updateTable('tiendas')
    .set({
      estado: 'prueba',
      pruebaHasta: new Date(Date.now() + 26 * 3_600_000),
      planHasta: null,
    })
    .where('slug', '=', 'heladeria')
    .execute();
}
