import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { privadosBajo } from '../../../test/bucket.js';
import { maliciosos, png } from '../../../test/imagenes.js';

const reporte = {
  pantalla: 'productos',
  descripcion: 'No me deja guardar la foto del producto.',
};

// El comercio reporta un problema desde su panel (Etapa 14.5, parte D).
describe('panel: reportes', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('crea reportes numerados y los lista con su estado', async () => {
    const a = await ctx.panel.post('/panel/reportes', reporte).expect(201);
    const b = await ctx.panel.post('/panel/reportes', reporte).expect(201);
    expect([a.body.numero, b.body.numero]).toEqual([1, 2]);
    const { body } = await ctx.panel.get('/panel/reportes').expect(200);
    expect(body[0]).toMatchObject({
      numero: 2,
      estado: 'nuevo',
      conCaptura: 0,
      respuesta: null,
    });
  });

  it('valida la pantalla, el largo del texto y no acepta campos de más', async () => {
    await ctx.panel.post('/panel/reportes', { ...reporte, pantalla: 'x' }).expect(400);
    await ctx.panel
      .post('/panel/reportes', { ...reporte, descripcion: 'corto' })
      .expect(400);
    await ctx.panel
      .post('/panel/reportes', { ...reporte, estado: 'resuelto' })
      .expect(400);
  });

  it('adjunta una captura (como WebP, al bucket privado) una sola vez', async () => {
    const { body } = await ctx.panel.post('/panel/reportes', reporte).expect(201);
    const ruta = `/panel/reportes/${body.id}/captura`;
    await ctx.panel.subir('put', ruta, 'captura', await png()).expect(200);
    const archivos = await privadosBajo('tiendas/');
    expect(archivos.some((c) => /reportes\/\d+\/.+\.webp$/.test(c))).toBe(true);
    await ctx.panel.subir('put', ruta, 'captura', await png()).expect(409);
  });

  it('rechaza SVG, texto disfrazado y archivos políglotas', async () => {
    const { body } = await ctx.panel.post('/panel/reportes', reporte).expect(201);
    for (const datos of Object.values(maliciosos)) {
      const r = await ctx.panel.subir(
        'put',
        `/panel/reportes/${body.id}/captura`,
        'captura',
        datos,
      );
      expect(r.status).toBe(400);
    }
  });
});
