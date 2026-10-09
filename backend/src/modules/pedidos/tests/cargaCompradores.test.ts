import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { comoTiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { esquemaCheckout } from '../schemas.js';
import { crearPedido } from '../servicios/checkout.service.js';

// Etapa 12: 100+ compradores a la vez (6.1), directo al servicio (sin rate limit por IP).
describe('carga: muchos compradores simultáneos', { timeout: 120_000 }, () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let tiendaId: ReturnType<typeof comoTiendaId>;
  const comprar = (lineas: Record<string, number>) =>
    crearPedido(tiendaId, esquemaCheckout.parse(pedido(t.productos, lineas)))
      .then(() => 'ok' as const)
      .catch((e: unknown) => {
        if (e instanceof AppError && e.codigo === 'sin_stock')
          return 'sin_stock' as const;
        throw e; // otro error (deadlock, timeout) hace fallar el test
      });
  const stock = (id: number) =>
    db
      .selectFrom('productos')
      .select(['stock', 'stockReservado'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

  beforeEach(async () => {
    t = await tiendaLista();
    const { id } = await db
      .selectFrom('tiendas')
      .select('id')
      .where('slug', '=', 'dona-rosa')
      .executeTakeFirstOrThrow();
    tiendaId = comoTiendaId(id);
  });

  it('150 compradores por 5 medialunas: se venden exactamente 5', async () => {
    const r = await Promise.all(
      Array.from({ length: 150 }, () => comprar({ medialuna: 1 })),
    );
    expect(r.filter((x) => x === 'ok')).toHaveLength(5);
    expect(await stock(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 5 });
    const numeros = (await db.selectFrom('pedidos').select('numero').execute())
      .map((p) => p.numero)
      .sort((a, b) => a - b);
    expect(numeros).toEqual([1, 2, 3, 4, 5]);
  });
  it('120 carritos mezclados (en distinto orden): sin deadlocks ni sobreventa', async () => {
    const r = await Promise.all(
      Array.from({ length: 120 }, (_, i) =>
        i % 2 ? comprar({ vigilante: 1, medialuna: 1 }) : comprar({ vigilante: 1 }),
      ),
    );
    const vendidos = await db
      .selectFrom('pedidoItems')
      .select((eb) => ['productoId', eb.fn.sum<number>('cantidad').as('total')])
      .groupBy('productoId')
      .execute();
    const de = (id: number) =>
      Number(vendidos.find((v) => v.productoId === id)?.total ?? 0);
    const vig = await stock(t.productos.vigilante);
    const med = await stock(t.productos.medialuna);
    expect(vig.stockReservado).toBe(de(t.productos.vigilante));
    expect(med.stockReservado).toBe(de(t.productos.medialuna));
    expect(vig.stockReservado).toBeLessThanOrEqual(vig.stock);
    expect(med.stockReservado).toBeLessThanOrEqual(med.stock);
    expect(r.filter((x) => x === 'ok').length).toBe(vig.stockReservado);
  });
});
