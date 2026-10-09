import type { Kysely } from 'kysely';
import { comoTiendaId, type TiendaId } from '../../shared/db/tiendaId.js';
import type { Database } from '../../shared/db/tipos/index.js';
import { idInsertado, type Tx } from './insertar.js';
import { insertarAgenda } from './insertarAgenda.js';
import type { DatosSeed } from './tipos.js';

async function insertarCatalogo(tx: Tx, tiendaId: TiendaId, datos: DatosSeed) {
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
export async function insertarTienda(
  db: Kysely<Database>,
  datos: DatosSeed,
  hashClave: string,
) {
  return db.transaction().execute(async (tx) => {
    const usuarioId = idInsertado(
      await tx
        .insertInto('usuarios')
        .values({
          ...datos.duenio,
          hashClave,
          emailVerificadoEn: new Date(),
        })
        .executeTakeFirstOrThrow(),
    );
    const tiendaId = comoTiendaId(
      idInsertado(
        await tx.insertInto('tiendas').values(datos.tienda).executeTakeFirstOrThrow(),
      ),
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
