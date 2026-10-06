import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { objetosBajo } from '../../../test/bucket.js';
import { png } from '../../../test/imagenes.js';

describe('logo: carreras y tienda suspendida', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let prefijo: string;
  let imagen: Buffer;
  const subir = () => p.subir('put', '/panel/tienda/logo', 'logo', imagen, 'logo.png');

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    imagen = await png();
    prefijo = `tiendas/${(await p.get('/panel/tienda/config')).body.id}/logo/`;
  });

  it('3 logos subidos a la vez dejan UN solo archivo en el bucket', async () => {
    const respuestas = await Promise.all([subir(), subir(), subir()]);
    expect(respuestas.map((r) => r.status)).toEqual([200, 200, 200]);
    const objetos = await objetosBajo(prefijo);
    expect(objetos).toHaveLength(1);
    expect((await p.get('/panel/tienda/config')).body.logoUrl).toContain(objetos[0]);
  });

  it('suspendida: no puede cambiar ni quitar el logo', async () => {
    await subir().expect(200);
    await db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'x' })
      .execute();
    expect((await subir()).status).toBe(403);
    await p.delete('/panel/tienda/logo').expect(403);
    expect(await objetosBajo(prefijo)).toHaveLength(1);
  });
});
