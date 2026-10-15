import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { idPedido, subirComprobante } from '../../../test/comprobantes.js';
import { png } from '../../../test/imagenes.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

// Encargos 2: todo encargo entra "por aceptar"; la seña se paga recién al aceptarlo.
describe('encargos: aceptar antes de cobrar', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const encargar = async () => {
    const datos = pedido(
      t.productos,
      { rogel: 1 },
      { tipo: 'encargo', fechaEncargo: enDias(3) },
    );
    const creado = (await t.comprador.post('/publico/pedidos', datos).expect(201)).body;
    return { ...creado, id: await idPedido(creado.numero) };
  };

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('con seña: nace por aceptar, sin pago ni plazo, y no admite comprobante', async () => {
    const e = await encargar();
    expect(e).toMatchObject({
      estado: 'pendiente_confirmacion',
      sena: 840000,
      pago: null,
      venceComprobanteEn: null,
    });
    const res = await subirComprobante(t.app, 'dona-rosa', e.token, await png());
    expect(res.body.error.codigo).toBe('pedido_sin_pago_pendiente');
  });

  it('al aceptarlo con seña pasa a pagar, arranca el plazo y avisa cuánto transferir', async () => {
    const e = await encargar();
    const res = await t.panel.post(`/panel/pedidos/${e.id}/aceptar`).expect(200);
    expect(res.body.estado).toBe('pendiente_pago');
    const horas = (Date.parse(res.body.venceComprobanteEn) - Date.now()) / 3_600_000;
    expect(horas).toBeCloseTo(24, 1);
    expect(decodeURIComponent(res.body.whatsapp)).toMatch(/transferí \$\s8\.400/);
    await subirComprobante(t.app, 'dona-rosa', e.token, await png()).expect(201);
  });

  it('sin seña: aceptarlo lo confirma', async () => {
    await db.updateTable('tiendas').set({ senaPorcentaje: 0 }).execute();
    const e = await encargar();
    const res = await t.panel.post(`/panel/pedidos/${e.id}/aceptar`).expect(200);
    expect(res.body).toMatchObject({ estado: 'confirmado', venceComprobanteEn: null });
  });
});
