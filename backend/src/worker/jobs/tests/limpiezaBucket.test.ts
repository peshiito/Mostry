import { beforeEach, describe, expect, it } from 'vitest';
import { subirWebp } from '../../../shared/archivos/almacenamiento.js';
import { clavesDeFoto } from '../../../shared/archivos/claves.js';
import { db } from '../../../shared/db/db.js';
import { objetosBajo } from '../../../test/bucket.js';
import { crearProducto, crearTienda } from '../../../test/fabricas.js';
import { png } from '../../../test/imagenes.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { barrerHuerfanos } from '../barrerHuerfanos.js';
import { reintentarBorrados } from '../reintentarBorrados.js';

describe('jobs de limpieza del bucket (RustFS real)', () => {
  let img: Buffer;

  beforeEach(async () => {
    await limpiarBase();
    img = await png();
  });

  it('reintentarBorrados borra lo pendiente y vacía la cola', async () => {
    await subirWebp('tiendas/1/logo/viejo.webp', img);
    await db
      .insertInto('archivosPorBorrar')
      .values({ clave: 'tiendas/1/logo/viejo.webp' })
      .execute();
    expect(await reintentarBorrados()).toEqual({ borrados: 1, fallidos: 0 });
    expect(await objetosBajo('tiendas/1/logo/')).toEqual([]);
    expect(await db.selectFrom('archivosPorBorrar').select('id').execute()).toEqual([]);
  });

  it('barrerHuerfanos borra solo lo que ninguna fila usa', async () => {
    const tiendaId = await crearTienda('dona-rosa');
    const productoId = await crearProducto(tiendaId);
    const base = `tiendas/${tiendaId}/productos/${productoId}/en-uso`;
    await db
      .insertInto('productoFotos')
      .values({ tiendaId, productoId, clave: base })
      .execute();
    const logo = `tiendas/${tiendaId}/logo/actual.webp`;
    await db.updateTable('tiendas').set({ logoClave: logo }).execute();
    const huerfana = `tiendas/${tiendaId}/productos/${productoId}/huerfana-1200.webp`;
    for (const c of [...Object.values(clavesDeFoto(base)), logo, huerfana])
      await subirWebp(c, img);

    // Con la antigüedad por defecto (24 h) no toca nada recién subido.
    expect((await barrerHuerfanos()).borradas).toBe(0);
    expect(await barrerHuerfanos({ antiguedadMs: 0 })).toEqual({
      revisadas: 4,
      borradas: 1,
      abortado: false,
    });
    expect(await objetosBajo(`tiendas/${tiendaId}/`)).toEqual(
      [...Object.values(clavesDeFoto(base)), logo].sort(),
    );
  });
});
