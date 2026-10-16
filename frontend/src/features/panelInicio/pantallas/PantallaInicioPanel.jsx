import { EsqueletoResumen } from '../../../shared/ui/esqueletos/index.js';
import { useSesion } from '../../sesion/useSesion.js';
import { TarjetaActivarAvisos } from '../../avisos/components/TarjetaActivarAvisos.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { TarjetaPagar } from '../../suscripcion/components/TarjetaPagar.jsx';
import { useSuscripcion } from '../../suscripcion/hooks/useSuscripcion.js';
import { AccesosDia } from '../components/AccesosDia.jsx';
import { SinVentasHoy } from '../components/SinVentasHoy.jsx';
import { StockBajo } from '../components/StockBajo.jsx';
import { TarjetaVentas } from '../components/TarjetaVentas.jsx';
import { useResumenDia } from '../hooks/useResumenDia.js';

const hoy = () =>
  new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

// Inicio del panel (Stitch 24, 50 suspendida y vacío).
export function PantallaInicioPanel() {
  const r = useResumenDia();
  const { soloLectura } = useSuscripcion();
  const usuarioNombre = useSesion().usuario?.nombre?.split(' ')[0];
  if (r.cargando) return <EsqueletoResumen />;
  return (
    <Pagina>
      {soloLectura ? <TarjetaPagar tono="ladrillo" /> : null}
      <TituloPagina titulo={`Hola, ${usuarioNombre ?? r.nombreDuena}`} bajada={hoy()} />
      {r.ventasHoy === 0 ? (
        <SinVentasHoy />
      ) : (
        <TarjetaVentas ventas={r.ventasHoy} pedidos={r.pedidosHoy} />
      )}
      <AccesosDia
        porAprobar={r.porAprobar}
        encargosManana={r.encargosManana}
        cajaAbierta={r.cajaAbierta}
      />
      {r.porAprobar > 0 && !soloLectura ? (
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          iconoFin="arrow_forward"
          to="/panel/pedidos"
        >
          Ver pedidos por aprobar ({r.porAprobar})
        </Boton>
      ) : null}
      <TarjetaActivarAvisos />
      <StockBajo productos={r.stockBajo} />
    </Pagina>
  );
}
