import { Outlet } from 'react-router';
import { PanelProveedor, usePanel } from '../../features/panelBase/PanelContexto.jsx';
import { BannerSuscripcion } from '../../features/suscripcion/components/BannerSuscripcion.jsx';
import { propsPaleta } from '../../shared/lib/paletas.js';
import { HeaderPanel } from './HeaderPanel.jsx';
import { NavPanel } from './NavPanel.jsx';
import css from './LayoutPanel.module.css';

// Estructura del panel: header, banner del plan, contenido y pestañas.
export function LayoutPanel() {
  return (
    <PanelProveedor>
      <MarcoPanel />
    </PanelProveedor>
  );
}

// El panel usa los colores que eligió la tienda (si los cambia, se ven al toque).
function MarcoPanel() {
  const { tienda } = usePanel();
  return (
    <div className={css.panel} {...propsPaleta(tienda.paleta)}>
      <HeaderPanel />
      <BannerSuscripcion />
      <Outlet />
      <NavPanel />
    </div>
  );
}
