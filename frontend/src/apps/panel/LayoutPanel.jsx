import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Esqueleto } from '../../shared/ui/Esqueleto.jsx';
import { PanelProveedor, usePanel } from '../../features/panelBase/PanelContexto.jsx';
import { BannerSoporte } from '../../features/soporte/components/BannerSoporte.jsx';
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
      <BannerSoporte />
      {/* Cada pantalla baja cuando se abre: header y pestañas quedan fijos. */}
      <Suspense fallback={<Esqueleto filas={5} />}>
        <Outlet />
      </Suspense>
      <NavPanel />
    </div>
  );
}
