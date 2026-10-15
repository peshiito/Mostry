import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { publico } from '../../../test/publico.js';
import { programaEjemplo } from './programaDatos.js';

// Lealtad L2: cada tienda ve y edita solo su programa; la vidriera lo muestra
// únicamente si está prendido y tiene premios.
describe('club: aislamiento y vidriera', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  const vidriera = async (slug = 'dona-rosa') =>
    (await publico(ctx.app, slug).get('/publico/tienda').expect(200)).body.club;

  beforeEach(async () => {
    ctx = await appConCuenta();
    await ctx.panel.put('/panel/club', programaEjemplo).expect(200);
  });

  it('otra tienda no ve ni pisa el programa ajeno', async () => {
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const suyo = panel(ctx.app, 'heladeria', martin.cookie);
    expect((await suyo.get('/panel/club')).body.premios).toEqual([]);
    await suyo.patch('/panel/club/activo', { activo: true }).expect(400);
    await suyo
      .put('/panel/club', { ...programaEjemplo, nombre: 'Club Helado' })
      .expect(200);
    expect((await ctx.panel.get('/panel/club')).body.nombre).toBe('Club Doña Rosa');
  });

  it('la vidriera muestra el club solo prendido', async () => {
    expect(await vidriera()).toBeNull();
    await ctx.panel.patch('/panel/club/activo', { activo: true }).expect(200);
    const club = await vidriera();
    expect(club).toMatchObject({ nombre: 'Club Doña Rosa', compraMinima: 500_000 });
    expect(club.premios.map((p: { compras: number }) => p.compras)).toEqual([5, 7, 10]);
    await ctx.panel.patch('/panel/club/activo', { activo: false });
    expect(await vidriera()).toBeNull();
  });

  it('la config de la tienda refleja el interruptor', async () => {
    await ctx.panel.patch('/panel/club/activo', { activo: true });
    const { body } = await ctx.panel.get('/panel/tienda/config');
    expect(body.usaClub).toBe(true);
  });
});
