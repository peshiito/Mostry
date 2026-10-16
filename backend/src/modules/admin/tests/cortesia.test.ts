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

// S1: el admin le regala días a una tienda.
describe('admin: días de cortesía', () => {
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

  it('en la prueba corre la fecha de la prueba', async () => {
    await fijar({ estado: 'prueba', pruebaHasta: dias(2), planHasta: null });
    const res = await regalar().expect(201);
    expect(res.body.estado).toBe('prueba');
    const t = await tienda();
    expect(enDias(t.pruebaHasta)).toBeCloseTo(9, 1);
    expect(t.planHasta).toBeNull();
  });

  it('con plan vigente suma al plan, sin perder días', async () => {
    await fijar({ estado: 'activa', pruebaHasta: dias(-30), planHasta: dias(5) });
    await regalar({ ...regalo, dias: 15 }).expect(201);
    expect(enDias((await tienda()).planHasta)).toBeCloseTo(20, 1);
  });

  it('suspendida por no pagar: cuenta desde hoy y vuelve a activa', async () => {
    await fijar({ estado: 'suspendida', pruebaHasta: dias(-40), planHasta: dias(-10) });
    await regalar().expect(201);
    const t = await tienda();
    expect(t.estado).toBe('activa');
    expect(enDias(t.planHasta)).toBeCloseTo(7, 1);
  });
});
