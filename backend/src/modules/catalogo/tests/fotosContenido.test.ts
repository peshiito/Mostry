import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { descargar, png } from '../../../test/imagenes.js';
import {
  firmaPngCuerpoJpg,
  jpgConPayload,
  webpReal,
} from '../../../test/imagenesTrampa.js';

describe('fotos: el contenido manda, no el nombre', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let ruta: string;
  let productoId: number;
  let tiendaId: number;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    productoId = (
      await p.post('/panel/productos', { nombre: 'Medialuna', precio: 1, stock: 1 })
    ).body.id;
    tiendaId = (await p.get('/panel/tienda/config')).body.id;
    ruta = `/panel/productos/${productoId}/fotos`;
  });

  it('un JPG con un script pegado al final se acepta, pero el script desaparece', async () => {
    const { body } = await p
      .subir('post', ruta, 'foto', await jpgConPayload())
      .expect(201);
    for (const url of [body.grande, body.chica]) {
      const { datos } = await descargar(url);
      expect(datos?.includes('<?php')).toBe(false);
      expect(datos?.includes('<script>')).toBe(false);
    }
  });

  it('firma de un formato con contenido de otro, o WebP real → 400', async () => {
    expect((await p.subir('post', ruta, 'foto', await firmaPngCuerpoJpg())).status).toBe(
      400,
    );
    expect(
      (await p.subir('post', ruta, 'foto', await webpReal(), 'foto.jpg')).status,
    ).toBe(400);
  });

  it('el nombre del archivo nunca llega a la clave (path traversal)', async () => {
    const malicioso = '../../../tiendas/999/logo/hack.webp';
    const { body } = await p
      .subir('post', ruta, 'foto', await png(), malicioso)
      .expect(201);
    const patron = new RegExp(
      `/tiendas/${tiendaId}/productos/${productoId}/[0-9a-f-]{36}-1200\\.webp$`,
    );
    expect(body.grande).toMatch(patron);
    await p.post('/panel/productos/..%2F2/fotos', {}).expect(400);
  });
});
