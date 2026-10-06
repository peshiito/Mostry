import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { CLAVE } from '../../../test/flujoAuth.js';

describe('alias de cobro (acción sensible)', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  const datos = { alias: 'Dona.Rosa.MP', titularAlias: 'Rosa Gómez' };

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('sin la contraseña correcta no se cambia', async () => {
    await ctx.panel
      .put('/panel/tienda/cobro', { ...datos, clave: 'no-es-la-clave' })
      .expect(400);
    await ctx.panel.put('/panel/tienda/cobro', datos).expect(400);
    expect((await ctx.panel.get('/panel/tienda/config')).body.alias).toBeNull();
  });

  it('con la contraseña se cambia (en minúscula) y se avisa por email a la dueña', async () => {
    const res = await ctx.panel
      .put('/panel/tienda/cobro', { ...datos, clave: CLAVE })
      .expect(200);
    expect(res.body).toEqual({ alias: 'dona.rosa.mp', titularAlias: 'Rosa Gómez' });
    const aviso = ctx.correo.enviados.at(-1);
    expect(aviso).toMatchObject({
      para: ctx.cuenta.email,
      asunto: 'Cambió el alias de cobro de tu tienda',
    });
  });

  it('valida el formato del alias', async () => {
    for (const alias of ['corto', 'con espacios aca', 'a'.repeat(21), 'ñandú.pagos']) {
      await ctx.panel
        .put('/panel/tienda/cobro', { ...datos, alias, clave: CLAVE })
        .expect(400);
    }
  });

  it('5 contraseñas equivocadas frenan a la cuenta (429)', async () => {
    const mal = { ...datos, clave: 'no-es-la-clave' };
    for (let i = 0; i < 5; i++)
      await ctx.panel.put('/panel/tienda/cobro', mal).expect(400);
    await ctx.panel.put('/panel/tienda/cobro', { ...datos, clave: CLAVE }).expect(429);
  });
});
