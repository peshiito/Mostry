import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { crearTienda } from '../../../test/fabricas.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

const DIA = 86_400_000;
const dias = (n: number) => new Date(Date.now() + n * DIA);
const pago = { monto: 1_000_000, pagadoEn: '2026-10-01' };

describe('admin: registrar pago y extender el plan', () => {
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;
  const fijar = (cambios: { pruebaHasta?: Date | null; planHasta?: Date | null }) =>
    db.updateTable('tiendas').set(cambios).where('id', '=', id).execute();
  const planHasta = async () =>
    (
      await db
        .selectFrom('tiendas')
        .select('planHasta')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
    ).planHasta!;
  const diasDesdeHoy = async () => ((await planHasta()).getTime() - Date.now()) / DIA;

  beforeEach(async () => {
    await limpiarBase();
    admin = await crearAdminLogueado(
      crearApp({ pingDb: async () => {}, mailer: crearMailerFalso().mailer }),
    );
    id = await crearTienda('dona-rosa');
  });

  it('pagando en la prueba no pierde los días que le quedaban', async () => {
    await fijar({ pruebaHasta: dias(4) });
    const res = await admin.post(`/admin/tiendas/${id}/pagos`, pago).expect(201);
    expect(res.body.estado).toBe('activa');
    expect(await diasDesdeHoy()).toBeCloseTo(34, 1);
  });

  it('con el plan vencido (suspendida) cuenta 30 días desde hoy y la reactiva', async () => {
    await fijar({ pruebaHasta: dias(-40), planHasta: dias(-10) });
    await admin.post(`/admin/tiendas/${id}/pagos`, pago).expect(201);
    expect(await diasDesdeHoy()).toBeCloseTo(30, 1);
  });

  it('dos pagos a la vez se suman: 60 días, no 30 (FOR UPDATE)', async () => {
    await fijar({ planHasta: dias(-1) });
    await Promise.all([
      admin.post(`/admin/tiendas/${id}/pagos`, pago).expect(201),
      admin.post(`/admin/tiendas/${id}/pagos`, pago).expect(201),
    ]);
    expect(await diasDesdeHoy()).toBeCloseTo(60, 1);
    expect(await db.selectFrom('pagosSuscripcion').select('id').execute()).toHaveLength(
      2,
    );
  });

  it('valida monto, fecha futura y tienda inexistente', async () => {
    await admin.post(`/admin/tiendas/${id}/pagos`, { ...pago, monto: 0 }).expect(400);
    await admin
      .post(`/admin/tiendas/${id}/pagos`, { ...pago, pagadoEn: '2099-01-01' })
      .expect(400);
    await admin.post('/admin/tiendas/9999/pagos', pago).expect(404);
  });
});
