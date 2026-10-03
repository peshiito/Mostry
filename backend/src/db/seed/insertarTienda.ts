import type { Kysely } from 'kysely';
import type { Database } from '../../shared/db/tipos/index.js';
import { idInsertado, type Tx } from './insertar.js';
import { insertarAgenda } from './insertarAgenda.js';
import type { DatosSeed } from './tipos.js';

// Hasta el módulo de auth nadie puede loguearse con esta clave (no es un hash válido).
export const CLAVE_PENDIENTE = '!pendiente-modulo-auth';

async function insertarCatalogo(tx: Tx, tiendaId: number, datos: DatosSeed) {
  for (const [orden, cat] of datos.categorias.entries()) {
    const categoriaId = idInsertado(
      await tx
        .insertInto('categorias')
        .values({ tiendaId, nombre: cat.nombre, orden })
        .executeTakeFirstOrThrow(),
    );
    const productos = cat.productos.map((p) => ({ ...p, tiendaId, categoriaId }));
    await tx.insertInto('productos').values(productos).execute();
  }
}

// Crea dueño, tienda, membresía, catálogo, horarios, feriado y promoción.
export async function insertarTienda(db: Kysely<Database>, datos: DatosSeed) {
  return db.transaction().execute(async (tx) => {
    const usuarioId = idInsertado(
      await tx
        .insertInto('usuarios')
        .values({
          ...datos.duenio,
          hashClave: CLAVE_PENDIENTE,
          emailVerificadoEn: new Date(),
        })
        .executeTakeFirstOrThrow(),
    );
    const tiendaId = idInsertado(
      await tx.insertInto('tiendas').values(datos.tienda).executeTakeFirstOrThrow(),
    );
    await tx
      .insertInto('miembrosTienda')
      .values({ tiendaId, usuarioId, rol: 'dueno' })
      .execute();
    await insertarCatalogo(tx, tiendaId, datos);
    await insertarAgenda(tx, tiendaId, datos);
    return tiendaId;
  });
}
