import { Route } from 'react-router';
import { PantallaIngresar } from '../../features/cuenta/pantallas/PantallaIngresar.jsx';
import { PantallaRecuperar } from '../../features/cuenta/pantallas/PantallaRecuperar.jsx';

// Ingreso y recuperación: iguales en el panel (base "/panel") y en el admin (base "").
// Las rutas son relativas al lugar donde se montan; `base` lo usan las pantallas para navegar.
export function rutasCuenta(base, admin) {
  return [
    <Route
      key="in"
      path="ingresar"
      element={<PantallaIngresar base={base} admin={admin} />}
    />,
    <Route key="re" path="recuperar" element={<PantallaRecuperar base={base} />} />,
  ];
}
