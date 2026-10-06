import { createContext } from 'react';
import AppDesconocida from '../../apps/sitio/AppDesconocida.jsx';
import { propsPaleta } from '../../shared/lib/paletas.js';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { Esqueleto } from '../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../shared/ui/Estado.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { adaptarTienda } from './lib/adaptar.js';

export const Tienda = createContext(null);

// Carga la tienda pública una vez (GET /publico/tienda) y la comparte.
export function TiendaProveedor({ slug, children }) {
  const { datos, cargando, error } = useConsulta('/publico/tienda');
  if (cargando) return <Esqueleto filas={6} />;
  if (error?.status === 404) return <AppDesconocida />;
  if (error) {
    return (
      <Pagina>
        <Estado error titulo="No pudimos cargar la tienda">
          Revisá tu conexión y recargá la página.
        </Estado>
      </Pagina>
    );
  }
  const valor = adaptarTienda(datos, slug);
  return (
    <Tienda.Provider value={valor}>
      <div {...propsPaleta(valor.tienda.paleta)}>{children}</div>
    </Tienda.Provider>
  );
}
