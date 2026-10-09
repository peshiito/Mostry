import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

const idDe = async (slug: string) =>
  (
    await db
      .selectFrom('tiendas')
      .select('id')
      .where('slug', '=', slug)
      .executeTakeFirstOrThrow()
  ).id;

// Modo soporte de punta a punta: permiso, cambios, registro y fin del permiso.
describe('modo soporte: flujo', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let base: string;

  beforeEach(async () => {
    t = await tiendaLista();
    admin = await crearAdminLogueado(t.app);
    base = `/admin/soporte/${await idDe('dona-rosa')}`;
    await t.panel.post('/panel/soporte/acceso').expect(200);
  });

  it('el comercio ve el permiso, cada cambio queda registrado con el producto', async () => {
    const id = t.productos.medialuna;
    await admin.patch(`${base}/productos/${id}`, { precio: 40000 }).expect(200);
    await admin.put(`${base}/horarios`, { tramos: [] }).expect(200);
    const { body } = await t.panel.get('/panel/soporte').expect(200);
    expect(body.acceso.venceEn).toBeTruthy();
    expect(body.registro.map((r: { accion: string }) => r.accion)).toEqual([
      'Cambió los horarios',
      expect.stringMatching(/^Editó un producto: «.+»$/),
    ]);
    const detalle = await admin
      .get(`/admin/tiendas/${await idDe('dona-rosa')}`)
      .expect(200);
    expect(detalle.body.soporte.venceEn).toBeTruthy();
  });

  it('un cambio rechazado no queda en el registro', async () => {
    await admin
      .patch(`${base}/productos/${t.productos.medialuna}`, { precio: -5 })
      .expect(400);
    expect((await t.panel.get('/panel/soporte')).body.registro).toEqual([]);
  });

  it('el comercio corta el acceso y el admin queda afuera al toque', async () => {
    await t.panel.delete('/panel/soporte/acceso').expect(200);
    await admin.get(`${base}/productos`).expect(403);
  });
});
