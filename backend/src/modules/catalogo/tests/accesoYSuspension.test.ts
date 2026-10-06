import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

describe('catálogo: sesión, membresía y tienda suspendida', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
  });

  it('sin sesión: 401; con sesión de otra tienda: 403', async () => {
    const sinSesion = panel(ctx.app, 'dona-rosa', '');
    await sinSesion.get('/panel/productos').expect(401);
    await sinSesion
      .post('/panel/productos', { nombre: 'x', precio: 1, stock: 1 })
      .expect(401);
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    await panel(ctx.app, 'dona-rosa', martin.cookie).get('/panel/categorias').expect(403);
  });

  it('suspendida: lee el catálogo pero no puede escribir nada', async () => {
    const cat = (await ctx.panel.post('/panel/categorias', { nombre: 'Facturas' })).body
      .id;
    const prod = (
      await ctx.panel.post('/panel/productos', {
        nombre: 'Medialuna',
        precio: 1,
        stock: 1,
      })
    ).body.id;
    await db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'Test' })
      .execute();

    await ctx.panel.get('/panel/productos').expect(200);
    await ctx.panel.get('/panel/categorias').expect(200);
    const escrituras = [
      ctx.panel.post('/panel/productos', { nombre: 'Nuevo', precio: 1, stock: 1 }),
      ctx.panel.patch(`/panel/productos/${prod}`, { precio: 2 }),
      ctx.panel.post('/panel/categorias', { nombre: 'Tortas' }),
      ctx.panel.patch(`/panel/categorias/${cat}`, { nombre: 'Otra' }),
      ctx.panel.put('/panel/categorias/orden', { ids: [cat] }),
      ctx.panel.delete(`/panel/categorias/${cat}`),
    ];
    for (const res of await Promise.all(escrituras)) {
      expect(res.status).toBe(403);
      expect(res.body.error.codigo).toBe('tienda_suspendida');
    }
    expect(await db.selectFrom('productos').select('nombre').execute()).toEqual([
      { nombre: 'Medialuna' },
    ]);
  });
});
