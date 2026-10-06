import { beforeEach, describe, expect, it } from 'vitest';
import { subirWebp } from '../../../shared/archivos/almacenamiento.js';
import { db } from '../../../shared/db/db.js';
import { objetosBajo } from '../../../test/bucket.js';
import { crearProducto, crearTienda } from '../../../test/fabricas.js';
import { png } from '../../../test/imagenes.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { barrerHuerfanos } from '../barrerHuerfanos.js';

describe('barrido de huérfanos: nunca borra fotos en uso', () => {
  let img: Buffer;
  beforeEach(async () => {
    await limpiarBase();
    img = await png();
  });

  it('con varias tiendas y un producto desactivado borra solo las huérfanas', async () => {
    for (const slug of ['dona-rosa', 'heladeria']) {
      const tiendaId = await crearTienda(slug);
      const productoId = await crearProducto(tiendaId);
      await db
        .updateTable('productos')
        .set({ activo: false })
        .where('id', '=', productoId)
        .execute();
      const base = `tiendas/${tiendaId}/productos/${productoId}/usada`;
      await db
        .insertInto('productoFotos')
        .values({ tiendaId, productoId, clave: base })
        .execute();
      // Incluye un tamaño "viejo" (1600): por prefijo sigue contando como usada.
      for (const c of [
        `${base}-1200.webp`,
        `${base}-1600.webp`,
        `tiendas/${tiendaId}/huerfana.webp`,
      ]) {
        await subirWebp(c, img);
      }
    }
    expect(await barrerHuerfanos({ antiguedadMs: 0 })).toEqual({
      revisadas: 6,
      borradas: 2,
      abortado: false,
    });
    const quedan = await objetosBajo('tiendas/');
    expect(quedan).toHaveLength(4);
    expect(quedan.every((c) => c.includes('/usada-'))).toBe(true);
  });

  it('freno de seguridad: si la base no referencia nada, no borra nada', async () => {
    await subirWebp('tiendas/1/productos/1/x-1200.webp', img);
    expect(await barrerHuerfanos({ antiguedadMs: 0 })).toEqual({
      revisadas: 1,
      borradas: 0,
      abortado: true,
    });
    expect(await objetosBajo('tiendas/')).toHaveLength(1);
  });
});
