import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { maliciosos, png, pngBomba } from '../../../test/imagenes.js';
import { panel } from '../../../test/panel.js';

describe('fotos: archivos maliciosos y accesos indebidos', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let ruta: string;
  const subir = (datos: Buffer, nombre?: string) =>
    ctx.panel.subir('post', ruta, 'foto', datos, nombre);

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

  it('rechaza SVG con script, texto disfrazado, GIF y políglotas (por contenido, no por nombre)', async () => {
    for (const [nombre, datos] of Object.entries(maliciosos)) {
      const res = await subir(datos, `${nombre}.jpg`);
      expect(res.status, nombre).toBe(400);
      expect(res.body.error.codigo, nombre).toBe('archivo_invalido');
    }
    expect(await db.selectFrom('productoFotos').select('id').execute()).toHaveLength(0);
  });

  it('frena la bomba de descompresión sin colgarse', async () => {
    const res = await subir(pngBomba());
    expect(res.status).toBe(400);
    expect(res.body.error.codigo).toBe('archivo_invalido');
  });

  it('más de 5 MB → 413; sin archivo → 400', async () => {
    const grande = Buffer.concat([await png(), Buffer.alloc(5 * 1024 * 1024)]);
    expect((await subir(grande)).status).toBe(413);
    expect((await ctx.panel.post(ruta, {})).status).toBe(400);
  });

  it('no se puede subir a un producto de otra tienda ni con la tienda suspendida', async () => {
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const ajeno = panel(ctx.app, 'heladeria', martin.cookie);
    expect((await ajeno.subir('post', ruta, 'foto', await png())).status).toBe(404);

    await db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'x' })
      .where('slug', '=', 'dona-rosa')
      .execute();
    expect((await subir(await png())).status).toBe(403);
  });
});
