import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { clubTienda, darSellos } from '../../../test/clubTienda.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

// Casos que marcó la revisión de Lealtad: canjes a la vez con productos (la
// foto de REPEATABLE READ), reenviar lo que devuelve el GET, fichas ajenas y
// que el admin vea solo cantidades.
describe('club: casos de la revisión', () => {
  let t: Awaited<ReturnType<typeof clubTienda>>;

  beforeEach(async () => {
    t = await clubTienda();
  });

  it('dos ventas con productos y el mismo premio a la vez: solo una pasa', async () => {
    await darSellos(2);
    const fichaClub = await t.ficha();
    const venta = {
      medio: 'transferencia',
      items: [{ productoId: t.productos.vigilante, cantidad: 2 }],
      fichaClub,
      premio: 2,
    };
    const [a, b] = await Promise.all([
      t.panel.post('/panel/caja/ventas', venta),
      t.panel.post('/panel/caja/ventas', venta),
    ]);
    expect([a.status, b.status].sort()).toEqual([201, 409]);
    expect(await db.selectFrom('canjes').selectAll().execute()).toHaveLength(1);
  });

  it('lo que devuelve GET /panel/club se puede guardar tal cual', async () => {
    const { body } = await t.panel.get('/panel/club').expect(200);
    const { activo: _, ...programa } = body;
    await t.panel.put('/panel/club', programa).expect(200);
  });

  it('la ficha de una tienda no sirve en otra', async () => {
    const fichaClub = await t.ficha();
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const otra = panel(t.app, 'heladeria', martin.cookie);
    await otra.put('/panel/club', {
      nombre: 'Club Helado',
      compraMinima: 0,
      venceMeses: null,
      premios: [{ compras: 1, tipo: 'regalo', descripcion: 'Un cucurucho' }],
    });
    await otra.patch('/panel/club/activo', { activo: true }).expect(200);
    await otra
      .post('/panel/caja/ventas', {
        medio: 'transferencia',
        suelto: { monto: 5000 },
        fichaClub,
      })
      .expect(404);
  });
  it('el admin solo ve cantidades', async () => {
    const { crearAdminLogueado } = await import('../../../test/adminCompleto.js');
    const admin = await crearAdminLogueado(t.app);
    const { body } = await admin.get('/admin/metricas').expect(200);
    expect(body.club).toEqual({ tiendasConClub: 1, socios: 1 });
  });
});
