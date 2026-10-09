import { Route } from 'react-router';
import { cargarPantalla } from '../../shared/lib/cargarPantalla.js';

const PantallaIngresar = cargarPantalla(
  () => import('../../features/cuenta/pantallas/PantallaIngresar.jsx'),
  'PantallaIngresar',
);
const PantallaRecuperar = cargarPantalla(
  () => import('../../features/cuenta/pantallas/PantallaRecuperar.jsx'),
  'PantallaRecuperar',
);

// Ingreso y recuperación: iguales en el panel (base "/panel") y en el admin (base "").
// Las rutas son relativas al lugar donde se montan; `base` lo usan las pantallas para navegar.
// `sitio`: ingreso desde la landing (lleva al admin o al panel de cada tienda).
export function rutasCuenta(base, admin, sitio) {
  return [
    <Route
      key="in"
      path="ingresar"
      element={<PantallaIngresar base={base} admin={admin} sitio={sitio} />}
    />,
    <Route key="re" path="recuperar" element={<PantallaRecuperar base={base} />} />,
  ];
}
