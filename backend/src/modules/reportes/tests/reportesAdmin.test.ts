import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearAdminLogueado, ORIGEN_ADMIN } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { privadosBajo } from '../../../test/bucket.js';
import { png } from '../../../test/imagenes.js';

const reporte = {
  pantalla: 'caja',
  descripcion: 'El cierre de caja me da una diferencia rara.',
};

// Bandeja de reportes del admin: ve el problema, la captura y responde.
describe('admin: reportes', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;

  beforeEach(async () => {
    ctx = await appConCuenta();
    admin = await crearAdminLogueado(ctx.app);
    id = (await ctx.panel.post('/panel/reportes', reporte).expect(201)).body.id;
    await ctx.panel
      .subir('put', `/panel/reportes/${id}/captura`, 'captura', await png())
      .expect(200);
  });

  it('lista los reportes con la tienda y cuenta los nuevos', async () => {
    const { body } = await admin.get('/admin/reportes').expect(200);
    expect(body.nuevos).toBe(1);
    expect(body.reportes[0]).toMatchObject({
      numero: 1,
      tienda: expect.any(String),
      conCaptura: 1,
    });
    expect(body.reportes[0]).not.toHaveProperty('claveCaptura');
  });

  it('el detalle trae la captura por URL firmada', async () => {
    const { body } = await admin.get(`/admin/reportes/${id}`).expect(200);
    expect(body.captura).toMatch(/X-Amz-Expires=300/);
    expect(body).not.toHaveProperty('claveCaptura');
  });

  it('responde, el comercio lo ve, y al resolver se borra la captura', async () => {
    await admin
      .patch(`/admin/reportes/${id}`, {
        estado: 'en_curso',
        respuesta: 'Lo estoy mirando',
      })
      .expect(200);
    const visto = (await ctx.panel.get('/panel/reportes').expect(200)).body[0];
    expect(visto).toMatchObject({ estado: 'en_curso', respuesta: 'Lo estoy mirando' });
    const { body } = await admin
      .patch(`/admin/reportes/${id}`, { estado: 'resuelto' })
      .expect(200);
    expect(body.captura).toBeNull();
    expect((await privadosBajo('tiendas/')).some((c) => c.includes('/reportes/'))).toBe(
      false,
    );
  });

  it('un comerciante no entra a la bandeja del admin', async () => {
    const r = request(ctx.app).get('/admin/reportes').set('Origin', ORIGEN_ADMIN);
    await r.set('Cookie', ctx.cuenta.cookie).expect(401);
  });
});
