import request from 'supertest';
import { datosAprobacion, idPedido, subirComprobante } from './comprobantes.js';
import { club, registrarCliente } from './clubListo.js';
import { png } from './imagenes.js';
import { origenTienda } from './sesionHttp.js';
import { pedido, tiendaLista } from './tiendaLista.js';

// Programa de prueba: suma desde $ 600 (2 medialunas sí, 1 no); premios a las 2 y 3.
export const programaTest = {
  nombre: 'Club Rosa',
  compraMinima: 60_000,
  venceMeses: null,
  premios: [
    { compras: 2, tipo: 'porcentaje', valor: 50, tope: 30_000, descripcion: null },
    { compras: 3, tipo: 'regalo', descripcion: 'Un café' },
  ],
};

// Tienda abierta con el club prendido + Ana, clienta del club con su cookie.
export async function clubTienda() {
  const t = await tiendaLista();
  await t.panel.put('/panel/club', programaTest).expect(200);
  await t.panel.patch('/panel/club/activo', { activo: true }).expect(200);
  const ana = await registrarCliente(t.app, t.correo);
  const comoAna = (ruta: string, body: object) =>
    request(t.app)
      .post(ruta)
      .set('Origin', origenTienda('dona-rosa'))
      .set('Cookie', ana.cookie)
      .send(body);
  const qr = async () => (await club(t.app, ana.cookie).get('/qr')).body.codigo as string;
  // La ficha firmada que da identificar (la que manda la venta del local).
  const ficha = async () =>
    (await t.panel.post('/panel/club/identificar', { codigo: await qr() })).body
      .ficha as string;

  // Ana compra online y el pedido llega hasta entregado (si `entregar`).
  async function comprar(lineas: Record<string, number>, entregar = true, extra = {}) {
    const creado = (
      await comoAna('/publico/pedidos', pedido(t.productos, lineas, extra)).expect(201)
    ).body;
    const id = await idPedido(creado.numero);
    if (!entregar) return { id, creado };
    await subirComprobante(t.app, 'dona-rosa', creado.token, await png()).expect(201);
    const [c] = (await t.panel.get(`/panel/pedidos/${id}/comprobantes`)).body;
    await t.panel
      .post(
        `/panel/pedidos/${id}/comprobantes/${c.id}/aprobar`,
        datosAprobacion(creado.pago.monto),
      )
      .expect(200);
    for (const estado of ['en_preparacion', 'listo_retirar', 'entregado'])
      await t.panel.post(`/panel/pedidos/${id}/estado`, { estado }).expect(200);
    return { id, creado };
  }
  return { ...t, ana, comoAna, qr, ficha, comprar };
}

export { darSellos } from './darSellos.js';
