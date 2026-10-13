import { createContext } from 'react';
import AppDesconocida from '../../apps/sitio/AppDesconocida.jsx';
import { propsPaleta } from '../../shared/lib/paletas.js';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { EsqueletoPantalla } from '../../shared/ui/esqueletos/index.js';
import { ErrorCarga } from '../../shared/ui/ErrorCarga.jsx';
import { adaptarTienda } from './lib/adaptar.js';

export const Tienda = createContext(null);

// Carga la tienda pública una vez (GET /publico/tienda) y la comparte.
export function TiendaProveedor({ slug, children }) {
  const { datos, cargando, error, recargar } = useConsulta('/publico/tienda');
  if (cargando) return <EsqueletoPantalla />;
  if (error?.status === 404) return <AppDesconocida />;
  if (error) return <ErrorCarga error={error} que="la tienda" onReintentar={recargar} />;
  const valor = adaptarTienda(datos, slug);
  return (
    <Tienda.Provider value={valor}>
      <div {...propsPaleta(valor.tienda.paleta)}>{children}</div>
    </Tienda.Provider>
  );
}
