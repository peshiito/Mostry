import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

// Captura de un reporte (siempre dentro de UNA tienda).
export const capturasRepo = {
  buscar: (tiendaId: TiendaId, id: number) =>
    db
      .selectFrom('reportes')
      .select(['id', 'estado', 'claveCaptura', 'creadoEn'])
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst(),

  ponerCaptura: (tiendaId: TiendaId, id: number, clave: string) =>
    db
      .updateTable('reportes')
      .set({ claveCaptura: clave })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .where('claveCaptura', 'is', null)
      // Si el admin lo resolvió mientras se subía, no se guarda (y se borra el archivo).
      .where('estado', '=', 'nuevo')
      .executeTakeFirst(),
};
