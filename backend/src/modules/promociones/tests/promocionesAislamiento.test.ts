import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { publico } from '../../../test/publico.js';

const enHoras = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

describe('promociones: aislamiento y vigencia pública', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('una creada inactiva no se ve en la tienda; otra tienda no la edita', async () => {
    const { id } = (
      await ctx.panel
        .post('/panel/promociones', {
          titulo: 'Borrador',
          desde: enHoras(-1),
          hasta: enHoras(5),
          activa: false,
        })
        .expect(201)
    ).body;
    expect(
      (await publico(ctx.app, 'dona-rosa').get('/publico/tienda')).body.promociones,
    ).toEqual([]);
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    await panel(ctx.app, 'heladeria', martin.cookie)
      .patch(`/panel/promociones/${id}`, { activa: true })
      .expect(404);
  });

  it('editar solo "desde" después del "hasta" actual: 400', async () => {
    const { id } = (
      await ctx.panel.post('/panel/promociones', {
        titulo: 'x2',
        desde: enHoras(0),
        hasta: enHoras(5),
      })
    ).body;
    expect(
      (
        await ctx.panel
          .patch(`/panel/promociones/${id}`, { desde: enHoras(10) })
          .expect(400)
      ).body.error.codigo,
    ).toBe('rango_invalido');
  });
});
