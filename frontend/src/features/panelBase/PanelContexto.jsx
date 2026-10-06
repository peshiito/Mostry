import { createContext, useContext } from 'react';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { Esqueleto } from '../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../shared/ui/Estado.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';

const Panel = createContext(null);

// Configuración de la tienda y estado del plan, compartidos por todo el panel.
export function PanelProveedor({ children }) {
  const config = useConsulta('/panel/tienda/config');
  const plan = useConsulta('/panel/tienda/suscripcion');
  if (config.cargando || plan.cargando) return <Esqueleto filas={6} />;
  if (config.error || plan.error) {
    return (
      <Pagina>
        <Estado error titulo="No pudimos cargar tu tienda">
          {(config.error ?? plan.error).message}
        </Estado>
      </Pagina>
    );
  }
  const valor = {
    tienda: config.datos,
    plan: plan.datos,
    recargarTienda: config.recargar,
    setTienda: config.setDatos,
    recargarPlan: plan.recargar,
  };
  return <Panel.Provider value={valor}>{children}</Panel.Provider>;
}

export function usePanel() {
  const p = useContext(Panel);
  if (!p) throw new Error('usePanel fuera de <PanelProveedor>');
  return p;
}
