import { Route } from 'react-router';
import { cargarPantalla } from '../../shared/lib/cargarPantalla.js';

const PantallaCheckout = cargarPantalla(
  () => import('../../features/checkout/pantallas/PantallaCheckout.jsx'),
  'PantallaCheckout',
);
const PantallaEncargo = cargarPantalla(
  () => import('../../features/checkout/pantallas/PantallaEncargo.jsx'),
  'PantallaEncargo',
);
const PantallaComprobanteEnviado = cargarPantalla(
  () => import('../../features/pedidoPublico/pantallas/PantallaComprobanteEnviado.jsx'),
  'PantallaComprobanteEnviado',
);
const PantallaPago = cargarPantalla(
  () => import('../../features/pedidoPublico/pantallas/PantallaPago.jsx'),
  'PantallaPago',
);
const PantallaSeguimiento = cargarPantalla(
  () => import('../../features/pedidoPublico/pantallas/PantallaSeguimiento.jsx'),
  'PantallaSeguimiento',
);

// Checkout (solo con la tienda abierta), pago y seguimiento (siempre: decisión 19).
export function RutasCompra({ cerrada }) {
  return [
    !cerrada && <Route key="co" path="checkout" element={<PantallaCheckout />} />,
    !cerrada && <Route key="en" path="checkout/encargo" element={<PantallaEncargo />} />,
    <Route key="pa" path="pedido/:token/pago" element={<PantallaPago />} />,
    <Route
      key="li"
      path="pedido/:token/listo"
      element={<PantallaComprobanteEnviado />}
    />,
    <Route key="se" path="pedido/:token" element={<PantallaSeguimiento />} />,
  ].filter(Boolean);
}
