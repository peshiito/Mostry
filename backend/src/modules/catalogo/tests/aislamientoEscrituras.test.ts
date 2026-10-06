import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

describe('catálogo: más vectores de IDOR entre tiendas', () => {
  let rosa: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let heladeria: ReturnType<typeof panel>;
  let catB: number;

  beforeEach(async () => {
    const ctx = await appConCuenta('dona-rosa');
    rosa = ctx.panel;
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    heladeria = panel(ctx.app, 'heladeria', martin.cookie);
    catB = (await heladeria.post('/panel/categorias', { nombre: 'Potes' })).body.id;
  });

  it('no puede mover un producto propio a una categoría ajena', async () => {
    const id = (
      await rosa.post('/panel/productos', { nombre: 'Medialuna', precio: 1, stock: 1 })
    ).body.id;
    await rosa.patch(`/panel/productos/${id}`, { categoriaId: catB }).expect(400);
    const prod = await db
      .selectFrom('productos')
      .select('categoriaId')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    expect(prod.categoriaId).toBeNull();
  });

  it('reordenar con ids ajenos falla y no toca la otra tienda', async () => {
    const propia = (await rosa.post('/panel/categorias', { nombre: 'Facturas' })).body.id;
    await rosa.put('/panel/categorias/orden', { ids: [catB, propia] }).expect(400);
    await rosa.put('/panel/categorias/orden', { ids: [catB] }).expect(400);
    const ajena = await db
      .selectFrom('categorias')
      .select('orden')
      .where('id', '=', catB)
      .executeTakeFirstOrThrow();
    expect(ajena.orden).toBe(0);
  });

  it('no ve categorías ajenas ni filtra por ellas', async () => {
    await heladeria.post('/panel/productos', {
      nombre: '1 kg',
      precio: 1,
      stock: 1,
      categoriaId: catB,
    });
    expect((await rosa.get('/panel/categorias')).body).toEqual([]);
    expect((await rosa.get(`/panel/productos?categoriaId=${catB}`)).body.total).toBe(0);
  });

  it('dos tiendas pueden tener una categoría con el mismo nombre', async () => {
    await rosa.post('/panel/categorias', { nombre: 'Potes' }).expect(201);
  });
});
