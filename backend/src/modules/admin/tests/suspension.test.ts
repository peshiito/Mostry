import { beforeEach, describe, expect, it } from 'vitest';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('admin: suspender y reactivar', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    admin = await crearAdminLogueado(ctx.app);
    id = (await ctx.panel.get('/panel/tienda/config')).body.id;
  });

  it('suspender bloquea las escrituras del panel aunque esté en prueba', async () => {
    await admin
      .post(`/admin/tiendas/${id}/suspender`, { motivo: 'Pago rechazado' })
      .expect(200);
    const res = await ctx.panel
      .patch('/panel/tienda/config', { frase: 'Hola' })
      .expect(403);
    expect(res.body.error.codigo).toBe('tienda_suspendida');
    expect((await ctx.panel.get('/panel/tienda/suscripcion')).body.estado).toBe(
      'suspendida',
    );
  });

  it('reactivar vuelve al estado que le toca por fechas', async () => {
    await admin
      .post(`/admin/tiendas/${id}/suspender`, { motivo: 'Revisión' })
      .expect(200);
    const res = await admin.post(`/admin/tiendas/${id}/reactivar`).expect(200);
    expect(res.body.estado).toBe('prueba');
    await ctx.panel.patch('/panel/tienda/config', { frase: 'Volví' }).expect(200);
  });

  it('el motivo es obligatorio y el detalle lo muestra', async () => {
    await admin.post(`/admin/tiendas/${id}/suspender`, {}).expect(400);
    await admin.post(`/admin/tiendas/${id}/suspender`, { motivo: 'Spam' }).expect(200);
    const { body } = await admin.get(`/admin/tiendas/${id}`).expect(200);
    expect(body.tienda).toMatchObject({
      suspendidaManual: true,
      motivoSuspension: 'Spam',
    });
    expect(body.duenos).toHaveLength(1);
    expect(body.conteos).toEqual({ productos: 0 });
  });
});
