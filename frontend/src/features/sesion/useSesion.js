import { useConsulta } from '../../shared/api/useConsulta.js';

// Quién está logueado (GET /auth/yo). error.status 401 = sin sesión completa.
export function useSesion() {
  const { datos, cargando, error, recargar } = useConsulta('/auth/yo');
  return {
    usuario: datos?.usuario ?? null,
    tiendas: datos?.tiendas ?? [],
    cargando,
    sinSesion: error?.status === 401 || error?.status === 403,
    error,
    recargar,
  };
}
