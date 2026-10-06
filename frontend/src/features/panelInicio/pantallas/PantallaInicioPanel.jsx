import { urlTienda } from '../../../shared/lib/urls.js';
import { ZONA_ACTUAL } from '../../../shared/lib/zonaActual.js';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { useSesion } from '../../sesion/useSesion.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { TarjetaPagar } from '../../suscripcion/components/TarjetaPagar.jsx';
import { useSuscripcion } from '../../suscripcion/hooks/useSuscripcion.js';
import { AccesosDia } from '../components/AccesosDia.jsx';
import { StockBajo } from '../components/StockBajo.jsx';
import { TarjetaVentas } from '../components/TarjetaVentas.jsx';
import { useResumenDia } from '../hooks/useResumenDia.js';

const hoy = () =>
  new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

const slugActual = () => ZONA_ACTUAL.slug;

// Inicio del panel (Stitch 24, 50 suspendida y vacío).
export function PantallaInicioPanel() {
  const r = useResumenDia();
  const { soloLectura } = useSuscripcion();
  const usuarioNombre = useSesion().usuario?.nombre?.split(' ')[0];
  if (r.cargando) return <Esqueleto filas={5} alto={88} />;
  return (
    <Pagina>
      {soloLectura ? <TarjetaPagar tono="ladrillo" /> : null}
      <TituloPagina titulo={`Hola, ${usuarioNombre ?? r.nombreDuena}`} bajada={hoy()} />
      {r.ventasHoy === 0 ? (
        <Tarjeta>
          <Estado icono="storefront" titulo="Todavía no vendiste hoy">
            Compartí el link de tu tienda para recibir pedidos.
          </Estado>
          <CopiarDato
            etiqueta="Tu tienda"
            valor={urlTienda(slugActual()).replace(/^https?:\/\//, '')}
          />
        </Tarjeta>
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
      <StockBajo productos={r.stockBajo} />
    </Pagina>
  );
}
