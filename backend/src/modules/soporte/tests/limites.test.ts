import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { idDeTienda, soporteListo } from '../../../test/soporteListo.js';

// El permiso de soporte dura 1 hora y es de UNA tienda.
describe('modo soporte: límites del permiso', () => {
  let ctx: Awaited<ReturnType<typeof soporteListo>>;
  beforeEach(async () => {
    ctx = await soporteListo();
  });

  it('el permiso vence a la hora', async () => {
    const hace = (h: number) => new Date(Date.now() - h * 3_600_000);
    await db
      .updateTable('accesosSoporte')
      .set({ creadoEn: hace(2), venceEn: hace(1) })
      .execute();
    await ctx.admin.get(`${ctx.base}/productos`).expect(403);
    expect((await ctx.t.panel.get('/panel/soporte')).body.acceso).toBeNull();
  });

  it('el permiso de una tienda no sirve para otra', async () => {
    const otra = await crearCuentaCompleta(ctx.t.app, ctx.t.correo, 'heladeria');
    const helado = panel(ctx.t.app, 'heladeria', otra.cookie);
    const ajeno = await helado.get('/panel/soporte').expect(200);
    expect(ajeno.body).toEqual({ acceso: null, registro: [] });
    await ctx.admin
      .get(`/admin/soporte/${await idDeTienda('heladeria')}/productos`)
      .expect(403);
    // Cortar desde otra tienda no toca el permiso de Doña Rosa.
    await helado.delete('/panel/soporte/acceso').expect(200);
    await ctx.admin.get(`${ctx.base}/productos`).expect(200);
  });
});
