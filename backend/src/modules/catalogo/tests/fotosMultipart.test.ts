import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { png } from '../../../test/imagenes.js';
import { origenTienda } from '../../../test/sesionHttp.js';

describe('fotos: multipart abusivo', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let ruta: string;
  const crudo = () =>
    request(ctx.app)
      .post(ruta)
      .set('Origin', origenTienda('dona-rosa'))
      .set('Cookie', ctx.cuenta.cookie);

  beforeEach(async () => {
    ctx = await appConCuenta();
    const id = (
      await ctx.panel.post('/panel/productos', {
        nombre: 'Medialuna',
        precio: 1,
        stock: 1,
      })
    ).body.id;
    ruta = `/panel/productos/${id}/fotos`;
  });

  it('dos archivos, un campo extra o el campo equivocado → 400', async () => {
    const img = await png();
    const casos = [
      crudo().attach('foto', img, 'a.png').attach('foto', img, 'b.png'),
      crudo().field('x', 'y').attach('foto', img, 'a.png'),
      crudo().attach('imagen', img, 'a.png'),
    ];
    for (const res of await Promise.all(casos)) {
      expect(res.status).toBe(400);
      expect(res.body.error.codigo).toBe('archivo_invalido');
    }
    expect(await db.selectFrom('productoFotos').select('id').execute()).toHaveLength(0);
  });

  it('un multipart cortado a la mitad es 400, no 500', async () => {
    const cuerpo =
      '--x\r\nContent-Disposition: form-data; name="foto"; filename="a.jpg"\r\n\r\nabc';
    const res = await crudo()
      .set('Content-Type', 'multipart/form-data; boundary=x')
      .send(cuerpo);
    expect(res.status).toBe(400);
  });
});
