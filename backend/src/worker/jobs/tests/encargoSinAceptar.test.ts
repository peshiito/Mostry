import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { cancelarVencidos } from '../cancelarVencidos.js';

// Encargos 2: un encargo que nadie aceptó no espera para siempre.
describe('cancelarVencidos: encargos sin aceptar', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const comprar = (datos: object) =>
    t.comprador.post('/publico/pedidos', datos).expect(201);

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('un encargo que nadie aceptó se cancela cuando pasa su fecha', async () => {
    const fecha = new Date(Date.now() + 3 * 86_400_000).toISOString();
    await comprar(
      pedido(t.productos, { rogel: 1 }, { tipo: 'encargo', fechaEncargo: fecha }),
    );
    expect((await cancelarVencidos()).cancelados).toBe(0);
    await db
      .updateTable('pedidos')
      .set({ fechaEncargo: new Date(Date.now() - 60_000) })
      .execute();
    expect(await cancelarVencidos()).toEqual({
      revisados: 1,
      cancelados: 1,
      fallidos: 0,
    });
    const p = await db
      .selectFrom('pedidos')
      .select(['estado', 'motivoCancelacion'])
      .executeTakeFirstOrThrow();
    expect(p).toEqual({
      estado: 'cancelado',
      motivoCancelacion: 'Pasó la fecha sin que la tienda lo aceptara',
    });
  });
});
