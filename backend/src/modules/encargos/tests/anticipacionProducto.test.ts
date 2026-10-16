import { beforeEach, describe, expect, it } from 'vitest';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const enHoras = (h: number) => new Date(Date.now() + h * 3_600_000);

// Encargos 3: cada producto puede pedir más anticipación que la tienda (24 h).
describe('encargos: anticipación por producto', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const encargar = (fecha: Date) =>
    t.comprador.post(
      '/publico/pedidos',
      pedido(
        t.productos,
        { rogel: 1 },
        { tipo: 'encargo', fechaEncargo: fecha.toISOString() },
      ),
    );

  beforeEach(async () => {
    t = await tiendaLista();
    await t.panel
      .patch('/panel/tienda/config', { anticipacionEncargoHoras: 24 })
      .expect(200);
  });

  it('se guarda en el producto y la vidriera la muestra', async () => {
    await t.panel
      .patch(`/panel/productos/${t.productos.rogel}`, { anticipacionHoras: 48 })
      .expect(200);
    const p = (await t.comprador.get(`/publico/productos/${t.productos.rogel}`)).body;
    expect(p.anticipacionHoras).toBe(48);
  });

  it('una torta de 48 h no se puede encargar a 30 h; a 50 h sí', async () => {
    await t.panel
      .patch(`/panel/productos/${t.productos.rogel}`, { anticipacionHoras: 48 })
      .expect(200);
    const res = await encargar(enHoras(30)).expect(400);
    expect(res.body.error.detalle).toEqual({ problema: 'anticipacion' });
    await encargar(enHoras(50)).expect(201);
  });

  it('si el producto pide menos que la tienda, gana la de la tienda', async () => {
    await t.panel
      .patch(`/panel/productos/${t.productos.rogel}`, { anticipacionHoras: 2 })
      .expect(200);
    await encargar(enHoras(10)).expect(400);
  });

  it('la disponibilidad recorta los turnos según los productos', async () => {
    await t.panel
      .patch(`/panel/productos/${t.productos.rogel}`, { anticipacionHoras: 72 })
      .expect(200);
    const fecha = enArgentina(enHoras(48)).fecha;
    const ver = (extra: string) =>
      t.comprador
        .get(`/publico/encargos/disponibilidad?fecha=${fecha}${extra}`)
        .expect(200);
    expect((await ver('')).body.disponible).toBe(true);
    const conTorta = (await ver(`&productos=${t.productos.rogel}`)).body;
    expect(conTorta).toMatchObject({ disponible: false, motivo: 'anticipacion' });
  });
});
