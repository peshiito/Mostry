import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { objetosBajo } from '../../../test/bucket.js';
import { png } from '../../../test/imagenes.js';

describe('fotos: concurrencia, orden y huérfanos', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let ruta: string;
  let prefijo: string;
  let imagen: Buffer;
  const subir = () => p.subir('post', ruta, 'foto', imagen);

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    imagen = await png();
    const id = (
      await p.post('/panel/productos', { nombre: 'Medialuna', precio: 1, stock: 1 })
    ).body.id;
    const { id: tiendaId } = (await p.get('/panel/tienda/config')).body;
    ruta = `/panel/productos/${id}/fotos`;
    prefijo = `tiendas/${tiendaId}/productos/${id}/`;
  });

  it('4 subidas simultáneas con 3 fotos: entran 2, rebotan 2, sin huérfanos', async () => {
    for (let i = 0; i < 3; i++) await subir().expect(201);
    const respuestas = await Promise.all(
      Array.from({ length: 4 }, async () => (await subir()).status),
    );
    expect(respuestas.sort()).toEqual([201, 201, 409, 409]);
    const filas = await db.selectFrom('productoFotos').select('orden').execute();
    expect(new Set(filas.map((f) => f.orden)).size).toBe(5);
    expect(await objetosBajo(prefijo)).toHaveLength(10); // 5 fotos × 2 tamaños
  });

  it('borrar y volver a subir no repite el orden', async () => {
    const a = await subir().expect(201);
    await subir().expect(201);
    await subir().expect(201);
    await p.delete(`${ruta}/${a.body.id}`).expect(204);
    await subir().expect(201);
    const ordenes = (await p.get(ruta)).body.map((f: { orden: number }) => f.orden);
    expect(new Set(ordenes).size).toBe(ordenes.length);
  });
});
