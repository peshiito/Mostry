import { beforeEach, describe, expect, it } from 'vitest';
import { subirPrivado } from '../../../shared/archivos/privado.js';
import { db } from '../../../shared/db/db.js';
import { privadosBajo } from '../../../test/bucket.js';
import { crearTienda } from '../../../test/fabricas.js';
import { png } from '../../../test/imagenes.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { barrerHuerfanos } from '../barrerHuerfanos.js';

// Las capturas de reportes abiertos viven en el bucket privado: el barrido de
// huérfanos no las tiene que borrar (solo lo que ninguna fila usa).
describe('barrido de huérfanos: capturas de reportes', () => {
  beforeEach(limpiarBase);

  it('conserva la captura de un reporte y borra la huérfana', async () => {
    const tiendaId = await crearTienda('dona-rosa');
    const { insertId } = await db
      .insertInto('usuarios')
      .values({ email: 'r@test.com', nombre: 'Rosa', hashClave: 'x' })
      .executeTakeFirstOrThrow();
    const enUso = `tiendas/${tiendaId}/reportes/1/en-uso.webp`;
    const huerfana = `tiendas/${tiendaId}/reportes/2/huerfana.webp`;
    await db
      .insertInto('reportes')
      .values({
        tiendaId,
        numero: 1,
        usuarioId: Number(insertId),
        pantalla: 'caja',
        descripcion: 'No cierra la caja del día',
        navegador: null,
        claveCaptura: enUso,
      })
      .execute();
    const img = await png();
    for (const c of [enUso, huerfana]) await subirPrivado(c, img, 'image/webp');

    const r = await barrerHuerfanos({ bucket: 'privado', antiguedadMs: 0 });
    expect(r).toMatchObject({ borradas: 1, abortado: false });
    expect(await privadosBajo(`tiendas/${tiendaId}/reportes/`)).toEqual([enUso]);
  });
});
