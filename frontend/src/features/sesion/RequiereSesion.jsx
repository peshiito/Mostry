import { Navigate, Outlet } from 'react-router';
import { EsqueletoPantalla } from '../../shared/ui/esqueletos/index.js';
import { ErrorCarga } from '../../shared/ui/ErrorCarga.jsx';
import { PantallaAceptarTerminos } from './PantallaAceptarTerminos.jsx';
import { PantallaElegirClave } from './PantallaElegirClave.jsx';
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
  // Clave temporal del admin: primero elige una nueva (Mejoras 4).
  if (!admin && s.usuario?.debeCambiarClave)
    return <PantallaElegirClave alTerminar={s.recargar} />;
  // Términos nuevos (o cuenta de antes de la S2): los acepta una vez y sigue.
  if (!admin && s.usuario?.terminosPendientes)
    return <PantallaAceptarTerminos alTerminar={s.recargar} />;
  return (
    <>
      <VigiaSesion ingreso={ingreso} />
      {children ?? <Outlet />}
    </>
  );
}
