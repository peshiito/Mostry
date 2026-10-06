import { Route } from 'react-router';
import { PantallaCheckout } from '../../features/checkout/pantallas/PantallaCheckout.jsx';
import { PantallaEncargo } from '../../features/checkout/pantallas/PantallaEncargo.jsx';
import { PantallaComprobanteEnviado } from '../../features/pedidoPublico/pantallas/PantallaComprobanteEnviado.jsx';
import { PantallaPago } from '../../features/pedidoPublico/pantallas/PantallaPago.jsx';
import { PantallaSeguimiento } from '../../features/pedidoPublico/pantallas/PantallaSeguimiento.jsx';

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
