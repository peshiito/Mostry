import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../shared/db/db.js';
import { crearPedido, crearProducto, crearTienda } from '../../test/fabricas.js';
import { limpiarBase } from '../../test/limpiarBase.js';

// Las FK compuestas (tienda_id, id) impiden mezclar datos de dos tiendas,
// aunque el código de la app tuviera un bug.
describe('aislamiento entre tiendas en la base', () => {
  let tiendaA: number;
  let tiendaB: number;

  beforeEach(async () => {
    await limpiarBase();
    tiendaA = await crearTienda('tienda-a');
    tiendaB = await crearTienda('tienda-b');
  });

  it('un pedido de A no puede incluir un producto de B', async () => {
    const pedidoA = await crearPedido(tiendaA);
    const productoB = await crearProducto(tiendaB);
    const item = {
      pedidoId: pedidoA,
      productoId: productoB,
      nombre: 'x',
      precioUnitario: 1,
    };
    const insertar = (tiendaId: number) =>
      db
        .insertInto('pedidoItems')
        .values({ ...item, tiendaId, cantidad: 1, subtotal: 1 })
        .execute();

    await expect(insertar(tiendaA)).rejects.toThrow(/foreign key/i);
    await expect(insertar(tiendaB)).rejects.toThrow(/foreign key/i);
  });

  it('un producto de A no puede usar una categoría de B', async () => {
    const r = await db
      .insertInto('categorias')
      .values({ tiendaId: tiendaB, nombre: 'Tortas' })
      .executeTakeFirstOrThrow();
    const categoriaB = Number(r.insertId);
    const producto = {
      tiendaId: tiendaA,
      categoriaId: categoriaB,
      nombre: 'x',
      precio: 1,
    };
    await expect(db.insertInto('productos').values(producto).execute()).rejects.toThrow(
      /foreign key/i,
    );
  });

  it('un comprobante de A no puede apuntar a un pedido de B', async () => {
    const pedidoB = await crearPedido(tiendaB);
    const comprobante = { tiendaId: tiendaA, pedidoId: pedidoB, tipo: 'pago' as const };
    await expect(
      db
        .insertInto('comprobantes')
        .values({ ...comprobante, archivoTipo: 'jpg' })
        .execute(),
    ).rejects.toThrow(/foreign key/i);
  });
});
