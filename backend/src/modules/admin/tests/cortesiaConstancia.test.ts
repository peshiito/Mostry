import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

// S1: la cortesía deja constancia, la ve el comercio y no cuenta como cobrado.
describe('admin: constancia de los días de cortesía', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;
  const regalo = { dias: 10, motivo: 'Mantenimiento del servidor' };

  beforeEach(async () => {
    ctx = await appConCuenta();
    admin = await crearAdminLogueado(ctx.app);
    id = (await db.selectFrom('tiendas').select('id').executeTakeFirstOrThrow()).id;
    await admin.post(`/admin/tiendas/${id}/cortesia`, regalo).expect(201);
  });

  it('queda en registro_admin y en el detalle del admin', async () => {
    const fila = await db
      .selectFrom('registroAdmin')
      .select(['accion', 'detalle', 'tiendaId'])
      .executeTakeFirstOrThrow();
    expect(fila).toEqual({
      accion: 'cortesia',
      detalle: '+10 días: Mantenimiento del servidor',
      tiendaId: id,
    });
    const det = await admin.get(`/admin/tiendas/${id}`).expect(200);
    expect(det.body.pagos[0]).toMatchObject({ tipo: 'cortesia', monto: 0 });
  });

  it('no suma a lo cobrado y el comercio no ve la nota de un pago', async () => {
    const pago = { monto: 1_000_000, pagadoEn: '2026-10-01', nota: 'Nota interna' };
    await admin.post(`/admin/tiendas/${id}/pagos`, pago).expect(201);
    const m = (await admin.get('/admin/metricas').expect(200)).body;
    expect(m.cobradoMes).toEqual({ total: 1_000_000, pagos: 1 });
    const res = await ctx.panel.get('/panel/tienda/suscripcion/pagos').expect(200);
    expect(res.body).toHaveLength(2);
    expect(JSON.stringify(res.body)).not.toContain('Nota interna');
  });

  it('el comercio la ve en sus pagos, con el motivo', async () => {
    const res = await ctx.panel.get('/panel/tienda/suscripcion/pagos').expect(200);
    expect(res.body).toEqual([
      expect.objectContaining({
        tipo: 'cortesia',
        monto: 0,
        dias: 10,
        motivo: 'Mantenimiento del servidor',
      }),
    ]);
  });

  it('si no sos admin, 403', async () => {
    await request(ctx.app)
      .post(`/admin/tiendas/${id}/cortesia`)
      .set('Origin', 'http://admin.localhost:5173')
      .set('Cookie', ctx.cuenta.cookie)
      .send(regalo)
      .expect((r) => expect([401, 403]).toContain(r.status));
  });
});
