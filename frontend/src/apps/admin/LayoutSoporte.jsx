import { Suspense } from 'react';
import { useParams } from 'react-router';
import { BasePanelProveedor } from '../../features/panelBase/BasePanel.jsx';
import { PanelProveedor } from '../../features/panelBase/PanelContexto.jsx';
import { FranjaSoporte } from '../../features/soporte/components/FranjaSoporte.jsx';
import { NavSoporte } from '../../features/soporte/components/NavSoporte.jsx';
import { SinPermisoSoporte } from '../../features/soporte/components/SinPermisoSoporte.jsx';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { TransicionRuta } from '../../shared/movimiento/TransicionRuta.jsx';
import { RedSeguridad } from '../../shared/errores/RedSeguridad.jsx';
import { ErrorCarga } from '../../shared/ui/ErrorCarga.jsx';
import { EsqueletoLista, EsqueletoPantalla } from '../../shared/ui/esqueletos/index.js';

// Modo soporte del admin (Etapa 14.5, parte E): las mismas pantallas del panel
// (productos, categorías, horarios, datos), apuntando a /admin/soporte/:id.
// Solo con el permiso vigente que dio el comercio; la API lo vuelve a exigir.
export function LayoutSoporte() {
  const { tiendaId } = useParams();
  const id = Number(tiendaId) || 0;
  const { datos, cargando, error, recargar } = useConsulta(`/admin/tiendas/${id}`);
  if (cargando && !datos) return <EsqueletoPantalla />;
  if (error) return <ErrorCarga error={error} que="la tienda" onReintentar={recargar} />;
  if (!datos?.soporte) return <SinPermisoSoporte volver={`/tiendas/${id}`} />;
  const rutas = `/tiendas/${id}/soporte`;
  return (
    <BasePanelProveedor api={`/admin/soporte/${id}`} rutas={rutas}>
      <FranjaSoporte
        tienda={datos.tienda.nombre}
        venceEn={datos.soporte.venceEn}
        volver={`/tiendas/${id}`}
      />
      <NavSoporte base={rutas} />
      <PanelProveedor>
        <RedSeguridad inicio={`/tiendas/${id}`}>
          <Suspense fallback={<EsqueletoLista foto />}>
            <TransicionRuta />
          </Suspense>
        </RedSeguridad>
      </PanelProveedor>
    </BasePanelProveedor>
  );
}
