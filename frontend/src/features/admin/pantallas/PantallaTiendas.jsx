import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Paginador } from '../../../shared/ui/Paginador.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { Kpis } from '../components/Kpis.jsx';
import { TablaTiendas } from '../components/TablaTiendas.jsx';
import { ESTADOS_TIENDA } from '../estados.js';
import { useTiendasAdmin } from '../hooks/useTiendasAdmin.js';

// Lista de tiendas del admin (Stitch 54).
export function PantallaTiendas() {
  const a = useTiendasAdmin();
  const opciones = [
    { valor: 'todas', texto: 'Todas', cuenta: a.total },
    ...Object.entries(ESTADOS_TIENDA).map(([v, e]) => ({
      valor: v,
      texto: e.texto,
      cuenta: a.cuenta(v),
    })),
  ];
  return (
    <Pagina ancho="completo">
      <TituloPagina migas="Administración" titulo="Tiendas" />
      <Kpis
        items={[
          { etiqueta: 'Total de tiendas', valor: a.total },
          { etiqueta: 'En prueba', valor: a.cuenta('prueba'), tono: 'mostaza' },
          { etiqueta: 'Activas', valor: a.cuenta('activa'), tono: 'ok' },
          {
            etiqueta: 'En gracia o suspendidas',
            valor: a.cuenta('gracia') + a.cuenta('suspendida'),
            tono: 'ladrillo',
          },
        ]}
      />
      <Buscador
        valor={a.q}
        onCambio={a.setQ}
        placeholder="Buscar por nombre, link o email"
      />
      <Chips
        etiqueta="Estado"
        opciones={opciones}
        valor={a.estado}
        onCambio={a.setEstado}
      />
      {a.cargando ? <Esqueleto filas={4} /> : <TablaTiendas tiendas={a.tiendas} />}
      <Paginador pagina={a.pagina} paginas={a.paginas} onCambio={a.setPagina} />
    </Pagina>
  );
}
