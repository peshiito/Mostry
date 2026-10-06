import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('panel: categorías', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const crear = (nombre: string) => p.post('/panel/categorias', { nombre });

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('crea al final de la lista y no permite nombres repetidos', async () => {
    expect((await crear('Facturas').expect(201)).body).toMatchObject({
      nombre: 'Facturas',
      orden: 0,
    });
    expect((await crear('Tortas').expect(201)).body.orden).toBe(1);
    expect((await crear('Facturas').expect(409)).body.error.codigo).toBe(
      'categoria_repetida',
    );
  });

  it('reordena solo si mandás todas, cada una una vez', async () => {
    const a = (await crear('Facturas')).body.id;
    const b = (await crear('Tortas')).body.id;
    await p.put('/panel/categorias/orden', { ids: [a] }).expect(400);
    await p.put('/panel/categorias/orden', { ids: [a, a] }).expect(400);
    const res = await p.put('/panel/categorias/orden', { ids: [b, a] }).expect(200);
    expect(res.body.map((c: { nombre: string }) => c.nombre)).toEqual([
      'Tortas',
      'Facturas',
    ]);
  });

  it('renombra, y al borrar los productos quedan sin categoría (no se borran)', async () => {
    const id = (await crear('Facturas')).body.id;
    await p.patch(`/panel/categorias/${id}`, { nombre: 'Facturas caseras' }).expect(200);
    const prod = await p.post('/panel/productos', {
      nombre: 'Medialuna',
      precio: 35000,
      stock: 10,
      categoriaId: id,
    });
    await p.delete(`/panel/categorias/${id}`).expect(204);
    const producto = await p.get(`/panel/productos/${prod.body.id}`).expect(200);
    expect(producto.body).toMatchObject({ activo: true, categoriaId: null });
    await p.delete(`/panel/categorias/${id}`).expect(404);
  });

  it('cuenta los productos activos de cada categoría', async () => {
    const id = (await crear('Facturas')).body.id;
    await p.post('/panel/productos', {
      nombre: 'Medialuna',
      precio: 1,
      stock: 1,
      categoriaId: id,
    });
    await p.post('/panel/productos', {
      nombre: 'Vigilante',
      precio: 1,
      stock: 1,
      categoriaId: id,
      activo: false,
    });
    const [categoria] = (await p.get('/panel/categorias').expect(200)).body;
    expect(Number(categoria.productosActivos)).toBe(1);
  });
});
