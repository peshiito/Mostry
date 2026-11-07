import { createContext } from 'react';
import AppDesconocida from '../../apps/sitio/AppDesconocida.jsx';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { temaEfectivo } from '../../shared/temaTienda/temas.js';
import { useTemaTienda } from '../../shared/temaTienda/useTemaTienda.js';
import { EsqueletoPantalla } from '../../shared/ui/esqueletos/index.js';
import { ErrorCarga } from '../../shared/ui/ErrorCarga.jsx';
import { adaptarTienda } from './lib/adaptar.js';
import { AjustesProveedor } from '../pagina/AjustesPagina.jsx';
import './estilos/index.js';

export const Tienda = createContext(null);

// Viste toda la página con el tema de la tienda (colores, fuentes y forma).
function ConTema({ valor, children }) {
  const tema = temaEfectivo(valor.tienda);
  useTemaTienda(tema);
  return (
    <Tienda.Provider value={{ ...valor, tema }}>
      <div
        data-estilo={tema.base}
        data-encabezado={tema.encabezado}
        data-forma={tema.forma}
      >
        <AjustesProveedor ajustes={valor.tienda.pagina?.ajustes}>
          {children}
        </AjustesProveedor>
      </div>
    </Tienda.Provider>
  );
}

// Carga la tienda pública una vez (GET /publico/tienda) y la comparte.
export function TiendaProveedor({ slug, children }) {
  const { datos, cargando, error, recargar } = useConsulta('/publico/tienda');
  if (cargando) return <EsqueletoPantalla />;
  if (error?.status === 404) return <AppDesconocida />;
  if (error) return <ErrorCarga error={error} que="la tienda" onReintentar={recargar} />;
  return <ConTema valor={adaptarTienda(datos, slug)}>{children}</ConTema>;
}
