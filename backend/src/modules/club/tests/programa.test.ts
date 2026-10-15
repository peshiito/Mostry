import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { programaEjemplo as ejemplo } from './programaDatos.js';

// Lealtad L2: el programa de cada tienda se arma y se prende desde el panel.
describe('club: programa de la tienda', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  const codigo = (r: { body: { error: { codigo: string } } }) => r.body.error.codigo;

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('sin armar: apagado, sin premios y con un nombre sugerido', async () => {
    const { body } = await ctx.panel.get('/panel/club').expect(200);
    expect(body).toMatchObject({ activo: false, compraMinima: 0, premios: [] });
    expect(body.nombre).toMatch(/^Club /);
  });

  it('guarda el programa, lo prende y al apagarlo conserva todo', async () => {
    await ctx.panel.put('/panel/club', ejemplo).expect(200);
    const prendido = await ctx.panel.patch('/panel/club/activo', { activo: true });
    expect(prendido.body).toMatchObject({ activo: true, nombre: 'Club Doña Rosa' });
    expect(prendido.body.premios[2]).toEqual({
      compras: 10,
      tipo: 'regalo',
      valor: null,
      tope: null,
      descripcion: 'Una docena de facturas',
    });
    await ctx.panel.patch('/panel/club/activo', { activo: false }).expect(200);
    const { body } = await ctx.panel.get('/panel/club');
    expect(body).toMatchObject({ activo: false, venceMeses: 6, compraMinima: 500_000 });
    expect(body.premios).toHaveLength(3);
  });

  it('volver a guardar reemplaza los escalones', async () => {
    await ctx.panel.put('/panel/club', ejemplo).expect(200);
    const solo = {
      ...ejemplo,
      premios: [{ compras: 3, tipo: 'monto', valor: 100_000, descripcion: null }],
    };
    const { body } = await ctx.panel.put('/panel/club', solo).expect(200);
    expect(body.premios).toEqual([
      { compras: 3, tipo: 'monto', valor: 100_000, tope: null, descripcion: null },
    ]);
  });

  it('prender sin premios: 400', async () => {
    const r = await ctx.panel.patch('/panel/club/activo', { activo: true }).expect(400);
    expect(codigo(r)).toBe('club_sin_premios');
  });

  it('rechaza escalones desordenados, repetidos, de más o mal formados', async () => {
    const [a, b] = ejemplo.premios;
    const malos = [
      [b, a],
      [a, a],
      Array.from({ length: 7 }, (_, i) => ({ ...a, compras: i + 1 })),
      [{ ...a, valor: 120 }],
      [{ compras: 2, tipo: 'regalo', descripcion: '' }],
      [{ compras: 2, tipo: 'monto', valor: 100, tope: 50, descripcion: null }],
      [],
    ];
    for (const premios of malos)
      await ctx.panel.put('/panel/club', { ...ejemplo, premios }).expect(400);
    await ctx.panel.put('/panel/club', { ...ejemplo, extra: 1 }).expect(400);
  });
});
