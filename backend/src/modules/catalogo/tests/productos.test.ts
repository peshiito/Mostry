import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

const medialuna = {
  nombre: 'Medialuna de manteca',
  precio: 35000,
  stock: 120,
  stockMinimo: 24,
};

describe('panel: productos', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('crea con disponible y alerta calculados, sin exponer tiendaId', async () => {
    const res = await p.post('/panel/productos', medialuna).expect(201);
    expect(res.body).toMatchObject({
      ...medialuna,
      stockReservado: 0,
      stockDisponible: 120,
      stockBajo: false,
      activo: true,
    });
    expect(res.body.tiendaId).toBeUndefined();
  });

  it('rechaza mass assignment y valores inválidos', async () => {
    for (const extra of [{ tiendaId: 99 }, { stockReservado: 5 }, { id: 1 }]) {
      await p.post('/panel/productos', { ...medialuna, ...extra }).expect(400);
    }
    for (const malo of [
      { precio: 0 },
      { precio: 10.5 },
      { stock: -1 },
      { nombre: 'x' },
    ]) {
      await p.post('/panel/productos', { ...medialuna, ...malo }).expect(400);
    }
  });

  it('edita y desactiva (nunca borra)', async () => {
    const { id } = (await p.post('/panel/productos', medialuna)).body;
    const res = await p
      .patch(`/panel/productos/${id}`, { precio: 40000, activo: false })
      .expect(200);
    expect(res.body).toMatchObject({ precio: 40000, activo: false });
    expect(await db.selectFrom('productos').select('id').execute()).toHaveLength(1);
  });

  it('el stock no puede quedar por debajo de lo reservado por pedidos', async () => {
    const { id } = (await p.post('/panel/productos', medialuna)).body;
    await db
      .updateTable('productos')
      .set({ stockReservado: 10 })
      .where('id', '=', id)
      .execute();
    const res = await p
      .patch(`/panel/productos/${id}`, { stock: 9, stockAnterior: 120 })
      .expect(409);
    expect(res.body.error.codigo).toBe('stock_reservado');
    await p
      .patch(`/panel/productos/${id}`, { stock: 10, stockAnterior: 120 })
      .expect(200);
  });
});
