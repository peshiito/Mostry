import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { codigoTotp } from '../../../test/sesionHttp.js';

describe('alias de cobro (acción sensible)', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  const datos = { alias: 'Dona.Rosa.MP', titularAlias: 'Rosa Gómez' };

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('sin un TOTP válido no se cambia', async () => {
    await ctx.panel.put('/tienda/cobro', { ...datos, codigoTotp: '000000' }).expect(400);
    await ctx.panel.put('/tienda/cobro', datos).expect(400);
    expect((await ctx.panel.get('/tienda/config')).body.alias).toBeNull();
  });

  it('con TOTP se cambia (en minúscula) y se avisa por email a la dueña', async () => {
    const res = await ctx.panel
      .put('/tienda/cobro', { ...datos, codigoTotp: codigoTotp(ctx.cuenta.secreto) })
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
        .put('/tienda/cobro', { ...datos, alias, codigoTotp: '123456' })
        .expect(400);
    }
  });
});
