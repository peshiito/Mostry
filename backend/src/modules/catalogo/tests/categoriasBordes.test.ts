import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('categorías: casos borde', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const crear = async (nombre: string) =>
    (await p.post('/panel/categorias', { nombre }).expect(201)).body.id as number;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('renombrar a un nombre que ya existe da 409; a un id inexistente, 404', async () => {
    await crear('Facturas');
    const tortas = await crear('Tortas');
    const res = await p
      .patch(`/panel/categorias/${tortas}`, { nombre: 'Facturas' })
      .expect(409);
    expect(res.body.error.codigo).toBe('categoria_repetida');
    await p.patch('/panel/categorias/9999', { nombre: 'Otra' }).expect(404);
  });

  it('renombrar con el mismo nombre no da error', async () => {
    const id = await crear('Facturas');
    expect(
      (await p.patch(`/panel/categorias/${id}`, { nombre: 'Facturas' }).expect(200)).body,
    ).toEqual({ id, nombre: 'Facturas' });
  });

  it('después de borrar, la nueva va al final sin chocar', async () => {
    await crear('Facturas');
    await crear('Tortas');
    const c = await crear('Panes');
    await p.delete(`/panel/categorias/${c}`).expect(204);
    expect(
      (await p.post('/panel/categorias', { nombre: 'Postres' }).expect(201)).body.orden,
    ).toBe(2);
  });

  it('reordenar sin categorías (lista vacía) es válido', async () => {
    expect(
      (await p.put('/panel/categorias/orden', { ids: [] }).expect(200)).body,
    ).toEqual([]);
  });
});
