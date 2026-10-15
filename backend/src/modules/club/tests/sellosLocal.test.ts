import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { clubTienda } from '../../../test/clubTienda.js';

// Lealtad L3: en el local, el comercio identifica al cliente por su QR y la
// venta rápida suma el sello.
describe('club: identificar y sumar en el local', () => {
  let t: Awaited<ReturnType<typeof clubTienda>>;
  const vender = (extra: object) =>
    t.panel.post('/panel/caja/ventas', {
      medio: 'transferencia',
      suelto: { monto: 80_000 },
      ...extra,
    });

  beforeEach(async () => {
    t = await clubTienda();
  });

  it('identifica con el código del QR (también en minúscula)', async () => {
    const codigo = await t.qr();
    const { body } = await t.panel
      .post('/panel/club/identificar', { codigo: codigo.toLowerCase() })
      .expect(200);
    expect(body).toMatchObject({ nombre: 'Ana', sellos: 0, compraMinima: 60_000 });
    expect(body.premios.map((p: { disponible: boolean }) => p.disponible)).toEqual([
      false,
      false,
    ]);
    expect(Object.keys(body)).not.toContain('clienteId');
  });

  it('un código inventado o mal formado no sirve', async () => {
    await t.panel.post('/panel/club/identificar', { codigo: 'ABCDEF' }).expect(404);
    await t.panel.post('/panel/club/identificar', { codigo: '0OIL11' }).expect(400);
    await vender({ fichaClub: `1.${Date.now() + 60_000}.firma-falsa` }).expect(404);
  });

  it('la venta con el código suma el sello si llega al mínimo', async () => {
    const codigo = await t.qr();
    const fichaClub = await t.ficha();
    expect((await vender({ fichaClub }).expect(201)).body.sello).toBe(true);
    const chica = { suelto: { monto: 10_000 }, fichaClub };
    expect((await vender(chica).expect(201)).body.sello).toBe(false);
    const { body } = await t.panel.post('/panel/club/identificar', { codigo });
    expect(body.sellos).toBe(1);
  });

  it('otra tienda con club no ve los sellos de esta', async () => {
    const codigo = await t.qr();
    await vender({ fichaClub: await t.ficha() }).expect(201);
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const otra = panel(t.app, 'heladeria', martin.cookie);
    await otra.post('/panel/club/identificar', { codigo }).expect(409); // apagado
    await otra.put('/panel/club', {
      nombre: 'Club Helado',
      compraMinima: 0,
      venceMeses: null,
      premios: [{ compras: 1, tipo: 'regalo', descripcion: 'Un cucurucho' }],
    });
    await otra.patch('/panel/club/activo', { activo: true }).expect(200);
    const { body } = await otra.post('/panel/club/identificar', { codigo }).expect(200);
    expect(body.sellos).toBe(0);
    expect(await db.selectFrom('sellos').selectAll().execute()).toHaveLength(1);
  });
});
