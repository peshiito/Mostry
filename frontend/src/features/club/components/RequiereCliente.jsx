import { Navigate, Outlet } from 'react-router';
import { EsqueletoPantalla } from '../../../shared/ui/esqueletos/index.js';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { VigiaSesion } from '../../sesion/VigiaSesion.jsx';
import { useCliente } from '../hooks/useCliente.js';

const INGRESO = '/club/ingresar';

// Protege la app del Club: sin sesión, al ingreso. La API lo valida igual.
// Las pantallas reciben la cuenta por el contexto del Outlet.
export function RequiereCliente() {
  const c = useCliente();
  if (c.cargando) return <EsqueletoPantalla />;
  if (c.sinSesion) return <Navigate to={INGRESO} replace />;
  if (c.error)
    return <ErrorCarga error={c.error} que="tu cuenta" onReintentar={c.recargar} />;
  return (
    <>
      <VigiaSesion ingreso={INGRESO} />
      <Outlet context={c} />
    </>
  );
}
