import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

// "Nunca se puede vender de más, aunque compren 100 personas a la vez" (6.1).
// (La prueba de carga con 100+ compradores va en la Etapa 12.)
describe('checkout: compradores simultáneos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('20 compradores por la última medialuna x5: venden exactamente 5', async () => {
    const intentos = Array.from({ length: 20 }, () =>
      t.comprador.post('/publico/pedidos', pedido(t.productos, { medialuna: 1 })),
    );
    const estados = (await Promise.all(intentos)).map((r) => r.status);
    expect(estados.filter((s) => s === 201)).toHaveLength(5);
    // El resto rebota: 409 (sin stock) o 429 (rate limit del checkout: misma IP).
    expect(estados.filter((s) => s !== 201).every((s) => s === 409 || s === 429)).toBe(
      true,
    );

    const medialuna = await db
      .selectFrom('productos')
      .select(['stock', 'stockReservado'])
      .where('id', '=', t.productos.medialuna)
      .executeTakeFirstOrThrow();
    expect(medialuna).toEqual({ stock: 5, stockReservado: 5 });
    const numeros = (await db.selectFrom('pedidos').select('numero').execute())
      .map((p) => p.numero)
      .sort();
    expect(numeros).toEqual([1, 2, 3, 4, 5]);
  });
});
