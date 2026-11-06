import { beforeEach, describe, expect, it } from 'vitest';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { descargar, maliciosos, png } from '../../../test/imagenes.js';
import { panel } from '../../../test/panel.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Vidriera 2.0 (V3 y V4): portada y galería del local.
describe('vidriera: portada y galería', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const portada = (datos: Buffer) =>
    t.panel.subir(
      'put',
      '/panel/tienda/vidriera/portada',
      'portada',
      datos,
      'portada.png',
    );
  const foto = (datos: Buffer) =>
    t.panel.subir('post', '/panel/tienda/vidriera/galeria', 'foto', datos, 'foto.png');

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('la portada es un WebP público que ven la vidriera y el panel', async () => {
    const { portadaUrl } = (await portada(await png()).expect(200)).body;
    expect(await descargar(portadaUrl)).toMatchObject({
      status: 200,
      tipo: 'image/webp',
    });
    expect((await t.comprador.get('/publico/tienda')).body.portadaUrl).toBe(portadaUrl);
    expect((await t.panel.get('/panel/tienda/config')).body.portadaUrl).toBe(portadaUrl);
    await t.panel.delete('/panel/tienda/vidriera/portada').expect(204);
    expect((await descargar(portadaUrl)).status).not.toBe(200);
  });

  it('no acepta archivos que no son imágenes', async () => {
    for (const malo of Object.values(maliciosos)) await portada(malo).expect(400);
    await foto(maliciosos.svgConScript).expect(400);
  });

  it('la galería llega hasta 8 fotos y se pueden borrar', async () => {
    const imagen = await png();
    for (let i = 0; i < 8; i++) await foto(imagen).expect(201);
    const r = await foto(imagen).expect(409);
    expect(r.body.error.codigo).toBe('galeria_llena');
    const fotos = (await t.comprador.get('/publico/tienda')).body.galeria;
    expect(fotos).toHaveLength(8);
    await t.panel.delete(`/panel/tienda/vidriera/galeria/${fotos[0].id}`).expect(204);
    expect((await t.panel.get('/panel/tienda/vidriera/galeria')).body).toHaveLength(7);
  });

  it('otra tienda no ve ni borra las fotos ajenas', async () => {
    const [f] = (await foto(await png()).expect(201)).body;
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const ajeno = panel(t.app, 'heladeria', martin.cookie);
    expect((await ajeno.get('/panel/tienda/vidriera/galeria')).body).toEqual([]);
    await ajeno.delete(`/panel/tienda/vidriera/galeria/${f.id}`).expect(404);
    expect((await t.panel.get('/panel/tienda/vidriera/galeria')).body).toHaveLength(1);
  });
});
