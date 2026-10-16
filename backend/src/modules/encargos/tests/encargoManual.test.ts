import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { cargar } from '../../../test/encargoManual.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Encargos 3: el encargo cargado desde el panel entra aceptado; si ya pagó la
// seña, entra a la caja y el resto se cobra al entregar.
describe('encargos: cargados desde el panel', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const avanzar = (id: number, estado: string, extra = {}) =>
    t.panel.post(`/panel/pedidos/${id}/estado`, { estado, ...extra }).expect(200);

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('con seña en efectivo: entra aprobado, a la caja, y el resto al entregar', async () => {
    await t.panel.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    const p = (
      await cargar(t, { sena: { monto: 1000000, medio: 'efectivo' } }).expect(201)
    ).body;
    expect(p).toMatchObject({
      estado: 'pago_aprobado',
      origen: 'panel',
      tipo: 'encargo',
      total: 2800000,
      sena: 1000000,
    });
    expect(p.items[0]).toMatchObject({
      nombre: 'Rogel',
      personalizacion: 'Con frutillas',
    });
    const agenda = (await t.panel.get('/panel/encargos')).body;
    expect(agenda.map((e: { id: number }) => e.id)).toEqual([p.id]);
    for (const e of ['en_preparacion', 'listo_retirar']) await avanzar(p.id, e);
    await avanzar(p.id, 'entregado', { medioCobro: 'efectivo' });
    const caja = (await t.panel.get('/panel/caja')).body;
    expect(caja.movimientos.map((m: { monto: number; concepto: string }) => m)).toEqual([
      expect.objectContaining({ monto: 1000000, concepto: 'Seña del encargo #1' }),
      expect.objectContaining({ monto: 1800000, concepto: 'Resto del encargo #1' }),
    ]);
  });

  it('sin seña queda confirmado; con la caja cerrada y seña en efectivo no se crea', async () => {
    const res = await cargar(t, { sena: { monto: 1000, medio: 'efectivo' } }).expect(409);
    expect(res.body.error.codigo).toBe('caja_cerrada');
    expect(await db.selectFrom('pedidos').select('id').execute()).toEqual([]);
    const p = (await cargar(t).expect(201)).body;
    expect(p).toMatchObject({ estado: 'confirmado', sena: 0 });
    const transferida = await cargar(t, {
      sena: { monto: 500000, medio: 'transferencia' },
    });
    expect(transferida.status).toBe(201); // la transferencia entra aunque la caja esté cerrada
  });
});
