import { beforeEach, describe, expect, it } from 'vitest';
import { tiendaLista } from '../../../test/tiendaLista.js';

const tema = {
  base: 'calle',
  colores: { principal: '#F5E21B', acento: '#ff5a1f', fondo: '#141414' },
  fuentes: { titulos: 'marker', texto: 'space-grotesk' },
  forma: 'recta',
  encabezado: 'portada',
  fondo: { tipo: 'patron', patron: 'pared', intensidad: 40 },
  plantilla: 'clasica',
};

// Vidriera 2.0 (V1): el comercio guarda su tema y la vidriera lo recibe.
describe('tema de la tienda', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('se guarda (colores en minúscula) y lo ven la vidriera y el panel', async () => {
    const r = await t.panel.put('/panel/tienda/tema', tema).expect(200);
    expect(r.body.tema.colores.principal).toBe('#f5e21b');
    const pub = await t.comprador.get('/publico/tienda').expect(200);
    expect(pub.body.tema).toEqual({
      ...tema,
      colores: { ...tema.colores, principal: '#f5e21b' },
    });
    expect((await t.panel.get('/panel/tienda/config').expect(200)).body.tema.base).toBe(
      'calle',
    );
  });

  it('una tienda sin tema manda null (la vidriera usa su paleta)', async () => {
    expect((await t.comprador.get('/publico/tienda').expect(200)).body.tema).toBeNull();
  });

  it('rechaza colores, fuentes y campos inválidos', async () => {
    const malos = [
      { ...tema, colores: { ...tema.colores, fondo: 'red' } },
      { ...tema, fuentes: { titulos: 'comic-sans', texto: 'inter' } },
      { ...tema, fuentes: { titulos: 'rubik', texto: 'marker' } }, // grafiti en párrafos no
      { ...tema, fondo: { ...tema.fondo, intensidad: 300 } },
      { ...tema, extra: '<script>' },
      { ...tema, colores: { ...tema.colores, principal: 'url(javascript:1)' } },
    ];
    for (const m of malos) await t.panel.put('/panel/tienda/tema', m).expect(400);
  });
});
