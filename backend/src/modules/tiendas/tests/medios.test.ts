import sharp from 'sharp';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { lienzo, maliciosos, png } from '../../../test/imagenes.js';
import { panel } from '../../../test/panel.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { paginaDePrueba } from './paginaDePrueba.js';

const cuadro = (color: string) =>
  sharp({ create: { width: 40, height: 40, channels: 3, background: color } })
    .png()
    .toBuffer();
const gifAnimado = async (n: number) =>
  sharp(
    await Promise.all(
      Array.from({ length: n }, (_, i) => cuadro(i % 2 ? '#f00' : '#00f')),
    ),
    {
      join: { animated: true },
    },
  )
    .gif()
    .toBuffer();

// "Armá tu página" (P3): biblioteca de imágenes y GIF animados.
describe('medios de la tienda', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const subir = (datos: Buffer) =>
    t.panel.subir('post', '/panel/tienda/medios', 'archivo', datos, 'archivo.png');
  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('una foto queda en WebP y un GIF animado sigue animado', async () => {
    const foto = (await subir(await png()).expect(201)).body;
    expect(foto.tipo).toBe('foto');
    const gif = (await subir(await gifAnimado(4)).expect(201)).body;
    expect(gif.tipo).toBe('animado');
    const lista = (await t.panel.get('/panel/tienda/medios').expect(200)).body;
    expect(lista).toHaveLength(2);
    expect(lista[0].url).toMatch(/\/medios\/[\w-]+-1000\.webp$/);
    expect(lista[1].url).toMatch(/-1600\.webp$/);
  });

  it('rechaza lo que no es imagen y los GIF demasiado largos', async () => {
    for (const malo of Object.values(maliciosos)) await subir(malo).expect(400);
    await subir(await gifAnimado(301)).expect(400);
    await subir(await lienzo(10, 10).jpeg().toBuffer()).expect(201);
  });

  it('la página solo usa imágenes propias, y la vidriera recibe las que usa', async () => {
    const { id } = (await subir(await png()).expect(201)).body;
    const pagina = paginaDePrueba();
    const hero = pagina.bloques[0] as unknown as { datos: Record<string, unknown> };
    hero.datos.imagen = 'propia';
    hero.datos.medios = [id];
    await t.panel.put('/panel/tienda/pagina/borrador', pagina).expect(200);
    await t.panel.post('/panel/tienda/pagina/publicar').expect(200);
    const publica = (await t.comprador.get('/publico/tienda')).body;
    expect(publica.medios.map((m: { id: number }) => m.id)).toEqual([id]);

    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const ajeno = panel(t.app, 'heladeria', martin.cookie);
    await ajeno.put('/panel/tienda/pagina/borrador', pagina).expect(400);
    await ajeno.delete(`/panel/tienda/medios/${id}`).expect(404);
    expect((await ajeno.get('/panel/tienda/medios')).body).toEqual([]);
  });
});
