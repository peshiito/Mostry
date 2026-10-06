import { useConsulta } from '../../../shared/api/useConsulta.js';
import { plata } from '../../../shared/lib/plata.js';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { adaptarTiendaAdmin } from '../api/admin.js';
import { Kpis } from '../components/Kpis.jsx';
import { TablaTiendas } from '../components/TablaTiendas.jsx';

// Métricas básicas (Stitch 58): GET /admin/metricas + tiendas en gracia.
export function PantallaMetricas() {
  const m = useConsulta('/admin/metricas').datos;
  const gracia = useConsulta('/admin/tiendas?estado=gracia').datos;
  if (!m) return <Esqueleto filas={3} alto={96} />;
  const e = m.tiendas.porEstado;
  return (
    <Pagina ancho="completo">
      <TituloPagina migas="Administración" titulo="Métricas" />
      <Kpis
        items={[
          { etiqueta: 'Activas', valor: e.activa, tono: 'ok' },
          { etiqueta: 'En prueba', valor: e.prueba, tono: 'mostaza' },
          { etiqueta: 'En gracia', valor: e.gracia, tono: 'ladrillo' },
          { etiqueta: 'Suspendidas', valor: e.suspendida, tono: 'ladrillo' },
          { etiqueta: 'Altas en 30 días', valor: m.tiendas.nuevas30d },
          { etiqueta: 'Pedidos en 30 días', valor: m.pedidos30d },
          { etiqueta: 'Cobrado este mes', valor: plata(m.cobradoMes.total) },
        ]}
      />
      <Seccion titulo="En gracia (tienen que pagar)">
        <TablaTiendas
          tiendas={(gracia?.tiendas ?? []).map((t) => adaptarTiendaAdmin(t))}
        />
      </Seccion>
    </Pagina>
  );
}
