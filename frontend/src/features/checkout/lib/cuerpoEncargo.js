import { armarPedido } from '../hooks/useCrearPedido.js';

// Cuerpo del checkout de un encargo, con la personalización de cada producto
// (Encargos 2). `personal`: { [productoId]: { texto, foto } }.
export const cuerpoEncargo = ({ state, items, tienda, turno, personal }) =>
  armarPedido({
    ...state,
    items,
    costoEnvio: tienda.costoEnvio,
    fechaEncargo: turno.toISOString(),
    personalizar: Object.fromEntries(
      Object.entries(personal).map(([id, v]) => [id, v.texto ?? '']),
    ),
  });
