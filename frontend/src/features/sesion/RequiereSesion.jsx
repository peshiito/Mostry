import { Navigate, Outlet } from 'react-router';
import { Esqueleto } from '../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../shared/ui/Estado.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { useSesion } from './useSesion.js';

// Protege el panel y el admin: sin sesión completa, al ingreso.
// La API también lo valida en cada request; esto es solo para la navegación.
export function RequiereSesion({ ingreso, admin, children }) {
  const s = useSesion();
  if (s.cargando) return <Esqueleto filas={6} />;
  if (s.sinSesion) return <Navigate to={ingreso} replace />;
  if (s.error)
    return (
      <Pagina>
        <Estado error titulo="No pudimos conectarnos">
          Revisá que la API esté levantada y recargá.
        </Estado>
      </Pagina>
    );
  if (admin && !s.usuario?.esAdmin) return <Navigate to={ingreso} replace />;
  return children ?? <Outlet />;
}
