import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { publico } from '../../../test/publico.js';

describe('tienda pública: inicio', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let comprador: ReturnType<typeof publico>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    comprador = publico(ctx.app, 'dona-rosa');
  });

  it('muestra datos, entrega, horarios, apertura y promociones vigentes', async () => {
    await ctx.panel
      .put('/panel/horarios', {
        tramos: [{ diaSemana: 1, abre: '08:00', cierra: '20:00' }],
      })
      .expect(200);
    const [desde, hasta] = [-1000, 86_400_000].map((ms) =>
      new Date(Date.now() + ms).toISOString(),
    );
    await ctx.panel
      .post('/panel/promociones', { titulo: '2x1 en medialunas', desde, hasta })
      .expect(201);
    await ctx.panel.post('/panel/promociones', {
      titulo: 'Futura',
      desde: hasta,
      hasta: new Date(Date.now() + 2 * 86_400_000).toISOString(),
    });

    const { body } = await comprador.get('/publico/tienda').expect(200);
    expect(body).toMatchObject({
      nombre: 'Doña Rosa',
      disponible: true,
      entrega: { envio: true, retiro: true },
    });
    expect(body.horarios).toHaveLength(1);
    expect(body.apertura).toHaveProperty('abierta');
    expect(body.promociones.map((p: { titulo: string }) => p.titulo)).toEqual([
      '2x1 en medialunas',
    ]);
    // Nada interno: ni alias, ni estado de suscripción, ni ids de dueños.
    for (const campo of ['alias', 'estado', 'planHasta', 'pruebaHasta', 'titularAlias'])
      expect(body).not.toHaveProperty(campo);
  });

  it('suspendida: solo lo mínimo para "Cerrada temporalmente" y sin catálogo', async () => {
    await db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'x' })
      .execute();
    const { body } = await comprador.get('/publico/tienda').expect(200);
    expect(body).toEqual({
      nombre: 'Doña Rosa',
      frase: null,
      logoUrl: null,
      paleta: 'toldo',
      disponible: false,
    });
    expect(
      (await comprador.get('/publico/productos').expect(403)).body.error.codigo,
    ).toBe('tienda_cerrada');
  });
});
