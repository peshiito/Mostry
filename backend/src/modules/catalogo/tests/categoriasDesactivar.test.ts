import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('categorías: se desactivan, no se borran', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let id: number;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    id = (await p.post('/panel/categorias', { nombre: 'Facturas' }).expect(201)).body.id;
  });

  it('DELETE la saca del panel pero la fila sigue en la base', async () => {
    await p.delete(`/panel/categorias/${id}`).expect(204);
    expect((await p.get('/panel/categorias')).body).toEqual([]);
    const fila = await db
      .selectFrom('categorias')
      .select('activa')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    expect(fila.activa).toBe(false);
  });

  it('una desactivada no se puede renombrar, reordenar ni usar en productos', async () => {
    await p.delete(`/panel/categorias/${id}`).expect(204);
    await p.patch(`/panel/categorias/${id}`, { nombre: 'Otra' }).expect(404);
    await p.put('/panel/categorias/orden', { ids: [id] }).expect(400);
    const res = await p.post('/panel/productos', {
      nombre: 'Medialuna',
      precio: 1,
      stock: 1,
      categoriaId: id,
    });
    expect(res.status).toBe(400);
    expect(res.body.error.codigo).toBe('categoria_invalida');
  });

  it('su nombre queda libre: se puede crear o renombrar otra con ese nombre', async () => {
    const tortas = (await p.post('/panel/categorias', { nombre: 'Tortas' })).body.id;
    await p.delete(`/panel/categorias/${id}`).expect(204);
    await p.patch(`/panel/categorias/${tortas}`, { nombre: 'Facturas' }).expect(200);
    await p.post('/panel/categorias', { nombre: 'Facturas' }).expect(409);
    await p.delete(`/panel/categorias/${tortas}`).expect(204);
    const nueva = await p.post('/panel/categorias', { nombre: 'Facturas' }).expect(201);
    expect(nueva.body.id).not.toBe(id);
  });
});
