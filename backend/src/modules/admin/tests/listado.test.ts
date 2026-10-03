import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { crearTienda } from '../../../test/fabricas.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

const dias = (n: number) => new Date(Date.now() + n * 86_400_000);

describe('admin: lista de tiendas', () => {
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;

  beforeEach(async () => {
    await limpiarBase();
    admin = await crearAdminLogueado(
      crearApp({ pingDb: async () => {}, mailer: crearMailerFalso().mailer }),
    );
    for (const slug of ['dona-rosa', 'heladeria', 'computacion']) await crearTienda(slug);
    const fechas = { 'dona-rosa': dias(5), heladeria: dias(-1), computacion: dias(-10) };
    for (const [slug, pruebaHasta] of Object.entries(fechas)) {
      await db
        .updateTable('tiendas')
        .set({ pruebaHasta })
        .where('slug', '=', slug)
        .execute();
    }
  });

  it('lista todas con su estado calculado por fechas', async () => {
    const { body } = await admin.get('/admin/tiendas').expect(200);
    expect(body.total).toBe(3);
    const estados = Object.fromEntries(
      body.tiendas.map((t: { slug: string; estado: string }) => [t.slug, t.estado]),
    );
    expect(estados).toEqual({
      'dona-rosa': 'prueba',
      heladeria: 'gracia',
      computacion: 'suspendida',
    });
  });

  it('filtra por estado y busca por nombre o slug', async () => {
    const gracia = await admin.get('/admin/tiendas?estado=gracia').expect(200);
    expect(gracia.body.tiendas.map((t: { slug: string }) => t.slug)).toEqual([
      'heladeria',
    ]);
    const busqueda = await admin.get('/admin/tiendas?buscar=compu').expect(200);
    expect(busqueda.body.total).toBe(1);
  });

  it('un % en la búsqueda no funciona como comodín', async () => {
    const { body } = await admin.get('/admin/tiendas?buscar=%25').expect(200);
    expect(body.total).toBe(0);
  });

  it('valida los filtros', async () => {
    await admin.get('/admin/tiendas?estado=borrada').expect(400);
    await admin.get('/admin/tiendas?pagina=0').expect(400);
    await admin.get('/admin/tiendas?otro=1').expect(400);
  });
});
