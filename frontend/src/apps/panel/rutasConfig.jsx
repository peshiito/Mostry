import { Route } from 'react-router';
import { PantallaCuenta } from '../../features/cuentaPanel/PantallaCuenta.jsx';
import { PantallaMas } from '../../features/mas/PantallaMas.jsx';
import { PantallaCobros } from '../../features/miTienda/pantallas/PantallaCobros.jsx';
import { PantallaHorarios } from '../../features/miTienda/pantallas/PantallaHorarios.jsx';
import { PantallaMiTienda } from '../../features/miTienda/pantallas/PantallaMiTienda.jsx';
import { PantallaSuscripcion } from '../../features/suscripcion/pantallas/PantallaSuscripcion.jsx';

// Rutas de configuración y cuenta del panel (relativas a /panel).
export function rutasConfig() {
  return [
    <Route key="ma" path="mas" element={<PantallaMas />} />,
    <Route key="ti" path="tienda" element={<PantallaMiTienda />} />,
    <Route key="ho" path="horarios" element={<PantallaHorarios />} />,
    <Route key="co" path="cobros" element={<PantallaCobros />} />,
    <Route key="su" path="suscripcion" element={<PantallaSuscripcion />} />,
    <Route key="cu" path="cuenta" element={<PantallaCuenta />} />,
  ];
}
