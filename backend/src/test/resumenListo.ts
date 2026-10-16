import { suscripcion } from './avisos.js';
import { subirComprobante } from './comprobantes.js';
import { enDias } from './encargoManual.js';
import { png } from './imagenes.js';
import { pedido, tiendaLista } from './tiendaLista.js';

// Una tienda con un teléfono con avisos, un comprobante para revisar y un
// encargo por aceptar (Avisos 1, resumen de la mañana).
export async function resumenListo() {
  const t = await tiendaLista(); // abre todos los días de 00:00 a 24:00
  await t.panel.post('/panel/avisos/suscripciones', suscripcion(1)).expect(201);
  const { token } = (
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
      .expect(201)
  ).body;
  await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(201);
  const encargo = pedido(
    t.productos,
    { rogel: 1 },
    { tipo: 'encargo', fechaEncargo: enDias(3) },
  );
  await t.comprador.post('/publico/pedidos', encargo).expect(201);
  return t;
}
