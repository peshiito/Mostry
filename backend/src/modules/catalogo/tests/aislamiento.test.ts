import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

// Rosa está logueada en SU tienda e intenta tocar datos de la heladería
// usando ids de la heladería (IDOR).
describe('catálogo: aislamiento entre tiendas', () => {
  let rosa: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let productoB: number;
  let categoriaB: number;

  beforeEach(async () => {
    const ctx = await appConCuenta('dona-rosa');
    rosa = ctx.panel;
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const heladeria = panel(ctx.app, 'heladeria', martin.cookie);
    categoriaB = (await heladeria.post('/panel/categorias', { nombre: 'Potes' })).body.id;
    productoB = (
      await heladeria.post('/panel/productos', { nombre: '1 kg', precio: 1, stock: 5 })
    ).body.id;
  });

  it('no puede ver ni editar productos ajenos aunque conozca el id', async () => {
    await rosa.get(`/panel/productos/${productoB}`).expect(404);
    await rosa
      .patch(`/panel/productos/${productoB}`, { precio: 1, activo: false })
      .expect(404);
    const prod = await db
      .selectFrom('productos')
      .select('activo')
      .where('id', '=', productoB)
      .executeTakeFirstOrThrow();
    expect(prod.activo).toBe(true);
    expect((await rosa.get('/panel/productos')).body.total).toBe(0);
  });

  it('no puede tocar categorías ajenas ni usarlas en sus productos', async () => {
    await rosa.patch(`/panel/categorias/${categoriaB}`, { nombre: 'Mía' }).expect(404);
    await rosa.delete(`/panel/categorias/${categoriaB}`).expect(404);
    const res = await rosa.post('/panel/productos', {
      nombre: 'Robado',
      precio: 1,
      stock: 1,
      categoriaId: categoriaB,
    });
    expect(res.status).toBe(400);
    expect(
      await db
        .selectFrom('categorias')
        .select('id')
        .where('id', '=', categoriaB)
        .execute(),
    ).toHaveLength(1);
  });
});
