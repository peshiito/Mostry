import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

const medialuna = { nombre: 'Medialuna', precio: 35000, stock: 120 };

describe('editar producto: todo o nada y sin pisar ventas', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let id: number;
  const enBase = () =>
    db
      .selectFrom('productos')
      .select(['stock', 'precio', 'categoriaId'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    id = (await p.post('/panel/productos', medialuna).expect(201)).body.id;
  });

  it('si la categoría es inválida no se guarda NADA (ni el stock)', async () => {
    const res = await p.patch(`/panel/productos/${id}`, {
      stock: 50,
      stockAnterior: 120,
      precio: 1,
      categoriaId: 9999,
    });
    expect(res.status).toBe(400);
    expect(await enBase()).toEqual({ stock: 120, precio: 35000, categoriaId: null });
  });

  it('un formulario viejo no pisa el stock: 409 stock_cambio', async () => {
    // Mientras el comerciante editaba, un pedido aprobado descontó 2 unidades.
    await db.updateTable('productos').set({ stock: 118 }).where('id', '=', id).execute();
    const res = await p
      .patch(`/panel/productos/${id}`, { stock: 120, stockAnterior: 120, precio: 1 })
      .expect(409);
    expect(res.body.error).toMatchObject({ codigo: 'stock_cambio' });
    expect(res.body.error.mensaje).toContain('118');
    expect(await enBase()).toMatchObject({ stock: 118, precio: 35000 });
  });

  it('cambiar el stock exige stockAnterior', async () => {
    await p.patch(`/panel/productos/${id}`, { stock: 5 }).expect(400);
    await p.patch(`/panel/productos/${id}`, { stockAnterior: 120 }).expect(400);
    await p.patch(`/panel/productos/${id}`, { stock: 5, stockAnterior: 120 }).expect(200);
  });

  it('los ids del body tienen que ser enteros de verdad', async () => {
    for (const categoriaId of [true, '3', [3], 1.5]) {
      await p.patch(`/panel/productos/${id}`, { categoriaId }).expect(400);
    }
    await p.put('/panel/categorias/orden', { ids: ['1'] }).expect(400);
  });

  it('PATCH vacío, campos internos o id inválido dan 400; id inexistente 404', async () => {
    await p.patch(`/panel/productos/${id}`, {}).expect(400);
    await p.patch(`/panel/productos/${id}`, { stockReservado: 0 }).expect(400);
    await p.patch('/panel/productos/abc', { precio: 1 }).expect(400);
    await p.patch('/panel/productos/9999', { precio: 1 }).expect(404);
  });
});
