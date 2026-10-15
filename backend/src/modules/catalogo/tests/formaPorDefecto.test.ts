import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Regresión (revisión de Encargos 2): sumar la personalización no tiene que
// pisar la forma de stock de la tienda ni el stock calculado.
describe('catálogo: forma de stock por defecto', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('sin forma, el producto nuevo usa la de la tienda y no guarda stock', async () => {
    await db.updateTable('tiendas').set({ modoStock: 'simple' }).execute();
    const res = await t.panel
      .post('/panel/productos', { nombre: 'Pan casero', precio: 100000, stock: 50 })
      .expect(201);
    expect(res.body).toMatchObject({ modoStock: 'simple', stock: 0 });
  });
});
