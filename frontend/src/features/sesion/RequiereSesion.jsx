import { Navigate, Outlet } from 'react-router';
import { EsqueletoPantalla } from '../../shared/ui/esqueletos/index.js';
import { ErrorCarga } from '../../shared/ui/ErrorCarga.jsx';
import { useSesion } from './useSesion.js';
import { VigiaSesion } from './VigiaSesion.jsx';

// Protege el panel y el admin: sin sesión completa, al ingreso.
// La API también lo valida en cada request; esto es solo para la navegación.
export function RequiereSesion({ ingreso, admin, children }) {
  const s = useSesion();
  if (s.cargando) return <EsqueletoPantalla />;
  if (s.sinSesion) return <Navigate to={ingreso} replace />;
  if (s.error)
    return <ErrorCarga error={s.error} que="tu sesión" onReintentar={s.recargar} />;
  if (admin && !s.usuario?.esAdmin) return <Navigate to={ingreso} replace />;
  return (
    <>
      <VigiaSesion ingreso={ingreso} />
      {children ?? <Outlet />}
    </>
  );
}
