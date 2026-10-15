import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { club } from '../../../test/clubListo.js';
import { clubTienda } from '../../../test/clubTienda.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

// Lealtad L5: historial del cliente, socios de la tienda y borrar la cuenta.
describe('club: historiales', () => {
  let t: Awaited<ReturnType<typeof clubTienda>>;
  const vender = async (monto: number) => {
    const venta = {
      medio: 'transferencia',
      suelto: { monto },
      fichaClub: await t.ficha(),
    };
    await t.panel.post('/panel/caja/ventas', venta).expect(201);
  };

  beforeEach(async () => {
    t = await clubTienda();
    await t.comprar({ medialuna: 2 });
    await vender(10_000);
  });

  it('el cliente ve sus compras con sello, tienda y sin ids internos', async () => {
    const { body } = await club(t.app, t.ana.cookie).get('/historial').expect(200);
    // Las dos compras pueden caer en el mismo segundo: el orden no importa.
    const vistas = body.map((c: { origen: string; sello: boolean }) => [
      c.origen,
      c.sello,
    ]);
    expect(vistas.sort()).toEqual([
      ['pedido', true],
      ['venta', false],
    ]);
    expect(body[0].tienda.nombre).toBeTruthy();
    expect(body[0]).not.toHaveProperty('tiendaId');
  });

  it('la tienda ve a sus socios (solo el nombre) y la ficha; otra tienda no', async () => {
    const { body } = await t.panel.get('/panel/club/socios').expect(200);
    expect(body).toEqual([expect.objectContaining({ nombre: 'Ana', sellos: 1 })]);
    expect(Object.keys(body[0]).sort()).toEqual([
      'id',
      'nombre',
      'sellos',
      'ultimaCompra',
    ]);
    const ficha = await t.panel.get(`/panel/club/socios/${body[0].id}`).expect(200);
    expect(ficha.body.compras).toHaveLength(2);
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const otra = panel(t.app, 'heladeria', martin.cookie);
    expect((await otra.get('/panel/club/socios')).body).toEqual([]);
    await otra.get(`/panel/club/socios/${body[0].id}`).expect(404);
  });

  it('al borrar la cuenta, sus compras quedan como comunes y se borran sus sellos', async () => {
    const { CLAVE } = await import('../../../test/flujoAuth.js');
    await club(t.app, t.ana.cookie).delete('/cuenta', { clave: CLAVE }).expect(204);
    expect(await db.selectFrom('sellos').selectAll().execute()).toEqual([]);
    const pedidos = await db.selectFrom('pedidos').select('clienteId').execute();
    expect(pedidos.map((p) => p.clienteId)).toEqual([null]);
    expect((await t.panel.get('/panel/club/socios')).body).toEqual([]);
  });
});
