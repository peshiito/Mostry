import { Suspense } from 'react';
import { TransicionRuta } from '../../shared/movimiento/TransicionRuta.jsx';
import { RedSeguridad } from '../../shared/errores/RedSeguridad.jsx';
import { EsqueletoLista } from '../../shared/ui/esqueletos/index.js';
import { PanelProveedor, usePanel } from '../../features/panelBase/PanelContexto.jsx';
import { useBasePanel } from '../../features/panelBase/BasePanel.jsx';
import { PantallaEmpezar } from '../../features/empezar/PantallaEmpezar.jsx';
import { BannerSoporte } from '../../features/soporte/components/BannerSoporte.jsx';
import { BannerSuscripcion } from '../../features/suscripcion/components/BannerSuscripcion.jsx';
import { propsPaleta } from '../../shared/lib/paletas.js';
import { HeaderPanel } from './HeaderPanel.jsx';
import { NavPanel, ORDEN_PESTANAS } from './NavPanel.jsx';
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
  const { tienda, plan } = usePanel();
  const { soporte } = useBasePanel();
  // Todavía no contestó "Armá tu Mostry": primero las preguntas (Mejoras 3 A).
  // Suspendida no puede guardarlas: va al panel de solo lectura para pagar.
  const preguntar = !tienda.configuradaEn && !soporte && plan?.estado !== 'suspendida';
  if (preguntar) return <PantallaEmpezar />;
  return (
    <div className={css.panel} {...propsPaleta(tienda.paleta)}>
      <HeaderPanel />
      <BannerSuscripcion />
      <BannerSoporte />
      {/* Cada pantalla baja cuando se abre: header y pestañas quedan fijos. */}
      <RedSeguridad inicio="/panel">
        <Suspense fallback={<EsqueletoLista />}>
          <TransicionRuta orden={ORDEN_PESTANAS} soloFundido />
        </Suspense>
      </RedSeguridad>
      <NavPanel />
    </div>
  );
}
