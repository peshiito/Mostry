import { createContext, useContext } from 'react';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { Esqueleto } from '../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../shared/ui/Estado.jsx';
import { Pagina } from '../../shared/ui/Pagina.jsx';
import { useBasePanel } from './BasePanel.jsx';

const Panel = createContext(null);

// Configuración de la tienda y estado del plan, compartidos por todo el panel.
// En el modo soporte del admin no hay plan: la suscripción no es parte del soporte.
export function PanelProveedor({ children }) {
  const { api, soporte } = useBasePanel();
  const config = useConsulta(`${api}/tienda/config`);
  const plan = useConsulta(soporte ? null : `${api}/tienda/suscripcion`);
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
