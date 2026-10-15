import { beforeEach, describe, expect, it } from 'vitest';
import { idPedido } from '../../../test/comprobantes.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

// Encargos 2: todo encargo entra "por aceptar"; la seña se paga recién al aceptarlo.
describe('encargos: reglas de aceptar y rechazar', () => {
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

  it('no se acepta dos veces, ni un pedido inmediato, ni se saltea la seña', async () => {
    const e = await encargar();
    await t.panel
      .post(`/panel/pedidos/${e.id}/estado`, { estado: 'confirmado' })
      .expect(409);
    await t.panel.post(`/panel/pedidos/${e.id}/aceptar`).expect(200);
    await t.panel.post(`/panel/pedidos/${e.id}/aceptar`).expect(409);
    const inm = (
      await t.comprador.post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
    ).body;
    await t.panel
      .post(`/panel/pedidos/${await idPedido(inm.numero)}/aceptar`)
      .expect(409);
  });

  it('rechazarlo lo cancela con el motivo, sin nada que devolver', async () => {
    const e = await encargar();
    const res = await t.panel
      .post(`/panel/pedidos/${e.id}/cancelar`, { motivo: 'Ese sábado no llegamos' })
      .expect(200);
    expect(res.body).toMatchObject({ estado: 'cancelado', habiaPago: false });
  });

  it('otra tienda no puede aceptarlo', async () => {
    const e = await encargar();
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    await panel(t.app, 'heladeria', martin.cookie)
      .post(`/panel/pedidos/${e.id}/aceptar`)
      .expect(404);
  });
});
