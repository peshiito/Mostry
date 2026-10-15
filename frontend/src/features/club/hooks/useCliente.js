import { useConsulta } from '../../../shared/api/useConsulta.js';

// La cuenta del cliente del club (GET /club/yo). Sin sesión: `sinSesion`.
export function useCliente() {
  const c = useConsulta('/club/yo');
  const sinSesion = c.error?.status === 401;
  return {
    cliente: c.datos?.cliente ?? null,
    cargando: c.cargando,
    sinSesion,
    error: sinSesion ? null : c.error,
    recargar: c.recargar,
    setCliente: (cliente) => c.setDatos({ cliente }),
  };
}
