import { useAccion } from '../../../shared/api/useAccion.js';
import { calcularDescuento } from '../../club/lib/descuento.js';
import { publicoApi } from '../../tienda/api/publico.js';

// Arma el cuerpo de POST /publico/pedidos. Del navegador salen ids y cantidades;
// el servidor recalcula precios y total (6.1) y avisa si cambió algo.
// `premio`: el premio del Club elegido; el descuento de acá es solo el esperado.
// `personalizar`: { [productoId]: texto } de lo que se personaliza (Encargos 2).
export function armarPedido({
  datos,
  entrega,
  items,
  costoEnvio,
  fechaEncargo,
  premio,
  personalizar = {},
}) {
  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  return {
    tipo: fechaEncargo ? 'encargo' : 'inmediato',
    clienteNombre: datos.nombre.trim(),
    clienteWhatsapp: datos.whatsapp,
    entrega,
    ...(entrega === 'envio' ? { direccion: datos.direccion.trim() } : {}),
    ...(datos.linkMaps ? { linkMaps: datos.linkMaps.trim() } : {}),
    ...(fechaEncargo ? { fechaEncargo } : {}),
    items: items.map((i) => ({
      productoId: i.id,
      cantidad: i.cantidad,
      ...(personalizar[i.id]?.trim()
        ? { personalizacion: personalizar[i.id].trim() }
        : {}),
    })),
    ...(premio ? { premio: premio.compras } : {}),
    totalEsperado:
      subtotal -
      calcularDescuento(premio, subtotal) +
      (entrega === 'envio' ? costoEnvio : 0),
  };
}

// Campos de la API → campos del formulario.
const CAMPOS = {
  clienteNombre: 'nombre',
  clienteWhatsapp: 'whatsapp',
  direccion: 'direccion',
  linkMaps: 'linkMaps',
};
const camposCheckout = (c) =>
  Object.fromEntries(Object.entries(c).map(([k, v]) => [CAMPOS[k] ?? k, v]));

export function useCrearPedido() {
  const accion = useAccion(publicoApi.crearPedido);
  return {
    crear: accion.ejecutar,
    enviando: accion.enviando,
    error: accion.error,
    campos: camposCheckout(accion.campos),
  };
}
