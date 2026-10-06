import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { stockDe } from '../../../test/flujoPedido.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { cancelarVencidos } from '../cancelarVencidos.js';

const vencer = (numero: number, msAtras = 1000) =>
  db
    .updateTable('pedidos')
    .set({ venceComprobanteEn: new Date(Date.now() - msAtras) })
    .where('numero', '=', numero)
    .execute();

describe('cancelarVencidos: encargos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const comprar = (datos: object) =>
    t.comprador.post('/publico/pedidos', datos).expect(201);

  beforeEach(async () => {
    t = await tiendaLista();
    vi.restoreAllMocks();
  });

  it('un encargo con seña vencido se cancela sin tocar el stock de nadie', async () => {
    await comprar(pedido(t.productos, { medialuna: 2 }));
    const fecha = new Date(Date.now() + 3 * 86_400_000).toISOString();
    await comprar(
      pedido(t.productos, { rogel: 1 }, { tipo: 'encargo', fechaEncargo: fecha }),
    );
    await vencer(2);
    expect(await cancelarVencidos()).toEqual({
      revisados: 1,
      cancelados: 1,
      fallidos: 0,
    });
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 2 });
    expect(await stockDe(t.productos.rogel)).toEqual({ stock: 0, stockReservado: 0 });
  });
});
