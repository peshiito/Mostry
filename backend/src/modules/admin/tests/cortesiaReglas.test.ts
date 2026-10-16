import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { crearTienda } from '../../../test/fabricas.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

const DIA = 86_400_000;
const dias = (n: number) => new Date(Date.now() + n * DIA);
const regalo = { dias: 7, motivo: 'Mantenimiento del servidor' };

// S1: días de cortesía, casos borde: suspensión manual y validaciones.
describe('admin: días de cortesía (reglas)', () => {
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;
  const fijar = (cambios: object) =>
    db.updateTable('tiendas').set(cambios).where('id', '=', id).execute();
  const tienda = () =>
    db
      .selectFrom('tiendas')
      .select(['estado', 'pruebaHasta', 'planHasta'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  const enDias = (f: Date | null) => (f!.getTime() - Date.now()) / DIA;
  const regalar = (body: object = regalo) =>
    admin.post(`/admin/tiendas/${id}/cortesia`, body);

  beforeEach(async () => {
    await limpiarBase();
    admin = await crearAdminLogueado(
      crearApp({ pingDb: async () => {}, mailer: crearMailerFalso().mailer }),
    );
    id = await crearTienda('dona-rosa');
  });

  it('suspendida a mano: suma los días pero sigue suspendida', async () => {
    await fijar({
      estado: 'suspendida',
      suspendidaManual: true,
      motivoSuspension: 'Pedido del dueño',
      planHasta: dias(3),
    });
    expect((await regalar().expect(201)).body.estado).toBe('suspendida');
    const t = await tienda();
    expect(t.estado).toBe('suspendida');
    expect(enDias(t.planHasta)).toBeCloseTo(10, 1);
  });

  it('valida días, motivo y tienda inexistente', async () => {
    await regalar({ ...regalo, dias: 0 }).expect(400);
    await regalar({ ...regalo, dias: 61 }).expect(400);
    await regalar({ dias: 7, motivo: ' ' }).expect(400);
    await admin.post('/admin/tiendas/9999/cortesia', regalo).expect(404);
    // Sin verificar el email: la prueba no arrancó y no se le pisan los 7 días.
    await fijar({ pruebaHasta: null, planHasta: null });
    expect((await regalar().expect(409)).body.error.codigo).toBe('sin_verificar');
  });
});
