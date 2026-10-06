import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pedidosRepo } from '../../../modules/pedidos/repositorios/pedidos.repository.js';
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

describe('cancelarVencidos: bordes', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const comprar = (datos: object) =>
    t.comprador.post('/publico/pedidos', datos).expect(201);

  beforeEach(async () => {
    t = await tiendaLista();
    vi.restoreAllMocks();
  });

  it('si subió el comprobante entre la lectura y el lock, NO se cancela', async () => {
    await comprar(pedido(t.productos, { medialuna: 2 }));
    await vencer(1);
    const original = pedidosRepo.bloquear;
    vi.spyOn(pedidosRepo, 'bloquear').mockImplementationOnce(async (tx, tiendaId, id) => {
      await db
        .updateTable('pedidos')
        .set({ estado: 'comprobante_enviado', venceComprobanteEn: null })
        .where('id', '=', id)
        .execute();
      return original(tx, tiendaId, id);
    });
    expect(await cancelarVencidos()).toEqual({
      revisados: 1,
      cancelados: 0,
      fallidos: 0,
    });
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 2 });
  });

  it('un pedido que falla no frena a los demás (y el que falló queda intacto)', async () => {
    await comprar(pedido(t.productos, { medialuna: 1 }));
    await comprar(pedido(t.productos, { medialuna: 1 }));
    await vencer(1, 5000);
    await vencer(2, 1000);
    vi.spyOn(pedidosRepo, 'bloquear').mockRejectedValueOnce(new Error('falla de prueba'));
    expect(await cancelarVencidos()).toEqual({
      revisados: 2,
      cancelados: 1,
      fallidos: 1,
    });
    const estados = await db
      .selectFrom('pedidos')
      .select(['numero', 'estado'])
      .orderBy('numero')
      .execute();
    expect(estados).toEqual([
      { numero: 1, estado: 'pendiente_pago' },
      { numero: 2, estado: 'cancelado' },
    ]);
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 1 });
  });
});
