import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { descargar, jpgConExif, png } from '../../../test/imagenes.js';

describe('fotos de producto (RustFS real)', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let ruta: string;
  const subir = (datos: Buffer) => p.subir('post', ruta, 'foto', datos);

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    const id = (
      await p.post('/panel/productos', { nombre: 'Medialuna', precio: 1, stock: 1 })
    ).body.id;
    ruta = `/panel/productos/${id}/fotos`;
  });

  it('guarda dos WebP (1200 y 400) sin EXIF y sin el original', async () => {
    const res = await subir(await jpgConExif()).expect(201);
    const grande = await descargar(res.body.grande);
    const chica = await descargar(res.body.chica);
    expect(grande).toMatchObject({ status: 200, tipo: 'image/webp' });
    expect(grande.meta).toMatchObject({ format: 'webp', width: 1200, height: 900 });
    expect(chica.meta).toMatchObject({ width: 400, height: 300 });
    expect(grande.meta?.exif).toBeUndefined();
    expect(grande.datos?.includes('DATO-PRIVADO-EXIF')).toBe(false);
  });

  it('una imagen chica no se agranda; PNG también se acepta', async () => {
    const res = await subir(await png()).expect(201);
    expect((await descargar(res.body.grande)).meta).toMatchObject({
      width: 300,
      height: 300,
    });
  });

  it('máximo 5 fotos por producto', async () => {
    const imagen = await png();
    for (let i = 0; i < 5; i++) await subir(imagen).expect(201);
    const res = await subir(imagen).expect(409);
    expect(res.body.error.codigo).toBe('demasiadas_fotos');
    expect((await p.get(ruta)).body).toHaveLength(5);
  });

  it('reordena (la primera es la principal) y borra también del bucket', async () => {
    const a = (await subir(await png()).expect(201)).body;
    const b = (await subir(await png()).expect(201)).body;
    const orden = await p.put(`${ruta}/orden`, { ids: [b.id, a.id] }).expect(200);
    expect(orden.body.map((f: { id: number }) => f.id)).toEqual([b.id, a.id]);
    await p.put(`${ruta}/orden`, { ids: [a.id] }).expect(400);

    await p.delete(`${ruta}/${a.id}`).expect(204);
    expect((await descargar(a.grande)).status).not.toBe(200);
    await p.delete(`${ruta}/${a.id}`).expect(404);
  });
});
