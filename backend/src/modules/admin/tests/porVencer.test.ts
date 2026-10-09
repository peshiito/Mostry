import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { crearTienda } from '../../../test/fabricas.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

const dias = (n: number) => new Date(Date.now() + n * 86_400_000 - 60_000);
type Fila = { slug: string; diasRestantes: number; whatsapp: string | null };

// Lista "por vencer" del dashboard: a quién escribirle por WhatsApp.
describe('admin: tiendas por vencer', () => {
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;

  beforeEach(async () => {
    await limpiarBase();
    const mailer = crearMailerFalso().mailer;
    admin = await crearAdminLogueado(crearApp({ pingDb: async () => {}, mailer }));
    const fechas = { lejos: dias(8), manana: dias(1), pasado: dias(2), gracia: dias(-1) };
    for (const [slug, pruebaHasta] of Object.entries(fechas)) {
      await crearTienda(slug);
      await db
        .updateTable('tiendas')
        .set({ pruebaHasta, whatsapp: '1125303909' })
        .where('slug', '=', slug)
        .execute();
    }
  });

  it('trae las que vencen en 2 días o menos y las de gracia, la más urgente primero', async () => {
    const { body } = await admin.get('/admin/tiendas?porVencer=1').expect(200);
    expect(body.tiendas.map((t: Fila) => t.slug)).toEqual(['gracia', 'manana', 'pasado']);
    expect(body.tiendas[1]).toMatchObject({ diasRestantes: 1, whatsapp: '1125303909' });
  });

  it('el listado común trae el WhatsApp y el nombre del dueño, nada del negocio', async () => {
    const { body } = await admin.get('/admin/tiendas').expect(200);
    const claves = Object.keys(body.tiendas[0]).sort();
    expect(claves).toEqual(
      [
        'creadoEn',
        'diasRestantes',
        'emailDueno',
        'estado',
        'id',
        'nombre',
        'nombreDueno',
        'planHasta',
        'pruebaHasta',
        'slug',
        'suspendidaManual',
        'venceEl',
        'whatsapp',
      ].sort(),
    );
  });
});
