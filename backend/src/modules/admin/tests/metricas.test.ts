import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { crearTienda } from '../../../test/fabricas.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

describe('admin: métricas', () => {
  beforeEach(limpiarBase);

  it('cuenta tiendas por estado, nuevas y lo cobrado en el mes', async () => {
    const admin = await crearAdminLogueado(
      crearApp({ pingDb: async () => {}, mailer: crearMailerFalso().mailer }),
    );
    const id = await crearTienda('dona-rosa');
    await crearTienda('heladeria');
    const hoy = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });
    await admin
      .post(`/admin/tiendas/${id}/pagos`, { monto: 1_000_000, pagadoEn: hoy })
      .expect(201);
    await db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'x' })
      .where('slug', '=', 'heladeria')
      .execute();

    const { body } = await admin.get('/admin/metricas').expect(200);
    expect(body.tiendas).toMatchObject({
      total: 2,
      nuevas30d: 2,
      porEstado: { activa: 1, suspendida: 1 },
    });
    expect(body.cobradoMes).toEqual({ total: 1_000_000, pagos: 1 });
  });
});
