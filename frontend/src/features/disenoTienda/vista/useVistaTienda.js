import { useConsulta } from '../../../shared/api/useConsulta.js';
import { adaptarTienda } from '../../tienda/lib/adaptar.js';

// Los datos públicos de la tienda, para mostrarla tal cual en la vista previa.
// El panel vive en el mismo subdominio, así que la API resuelve la misma tienda.
export function useVistaTienda(slug) {
  const { datos, cargando, error } = useConsulta('/publico/tienda');
  return { valor: datos ? adaptarTienda(datos, slug) : null, cargando, error };
}
