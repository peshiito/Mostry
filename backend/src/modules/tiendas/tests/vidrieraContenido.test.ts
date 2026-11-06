import { beforeEach, describe, expect, it } from 'vitest';
import { tiendaLista } from '../../../test/tiendaLista.js';

const contenido = {
  sobreNosotros: 'Desde 1987 en el barrio.',
  redes: { instagram: 'https://www.instagram.com/donarosa', tiktok: null },
  secciones: [
    { id: 'catalogo', visible: true, titulo: 'Nuestras facturas' },
    { id: 'promo', visible: false },
  ],
};

// Vidriera 2.0 (V4): historia, redes y orden de las secciones.
describe('vidriera: contenido', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const guardar = (c: object) => t.panel.put('/panel/tienda/vidriera/contenido', c);
  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('se guarda y la vidriera lo recibe', async () => {
    await guardar(contenido).expect(200);
    expect((await t.comprador.get('/publico/tienda')).body.contenido).toEqual(contenido);
  });

  it('rechaza links falsos, secciones repetidas y campos de más', async () => {
    const malos = [
      { redes: { instagram: 'javascript:alert(1)' } },
      { redes: { instagram: 'http://instagram.com/x' } },
      { redes: { instagram: 'https://instagram.com.malo.com/x' } },
      { redes: { facebook: 'https://instagram.com/x' } },
      {
        secciones: [
          { id: 'promo', visible: true },
          { id: 'promo', visible: false },
        ],
      },
      { secciones: [{ id: 'inventada', visible: true }] },
      { sobreNosotros: 'x'.repeat(1201) },
      { ...contenido, html: '<script>' },
    ];
    for (const m of malos) await guardar(m).expect(400);
  });
});
