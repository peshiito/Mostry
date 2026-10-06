import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { descargar, maliciosos, png } from '../../../test/imagenes.js';

describe('logo de la tienda', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const subir = (datos: Buffer) =>
    p.subir('put', '/panel/tienda/logo', 'logo', datos, 'logo.png');

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('sube un WebP, la config devuelve la URL y no la clave interna', async () => {
    const { logoUrl } = (await subir(await png()).expect(200)).body;
    expect(await descargar(logoUrl)).toMatchObject({ status: 200, tipo: 'image/webp' });
    const config = (await p.get('/panel/tienda/config')).body;
    expect(config.logoUrl).toBe(logoUrl);
    expect(config.logoClave).toBeUndefined();
  });

  it('reemplazar borra el logo anterior del bucket; quitarlo también', async () => {
    const primero = (await subir(await png()).expect(200)).body.logoUrl;
    const segundo = (await subir(await png()).expect(200)).body.logoUrl;
    expect((await descargar(primero)).status).not.toBe(200);
    await p.delete('/panel/tienda/logo').expect(204);
    expect((await descargar(segundo)).status).not.toBe(200);
    expect((await p.get('/panel/tienda/config')).body.logoUrl).toBeNull();
  });

  it('nunca acepta un SVG como logo', async () => {
    expect((await subir(maliciosos.svgConScript)).status).toBe(400);
  });
});
