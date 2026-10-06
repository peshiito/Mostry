import { useParams } from 'react-router';
import { plata } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { HeaderTienda } from '../../tienda/components/HeaderTienda.jsx';
import { useTienda } from '../../tienda/hooks/useTienda.js';
import { usePedidoPublico } from '../hooks/usePedidoPublico.js';
import css from './PantallaComprobanteEnviado.module.css';

// Confirmación después de subir el comprobante (Stitch 19).
export function PantallaComprobanteEnviado() {
  const { token } = useParams();
  const { pedido } = usePedidoPublico(token);
  const { tienda } = useTienda();
  return (
    <>
      <HeaderTienda volver={`/pedido/${token}`} titulo={tienda.nombre} />
      <Pagina className={css.pagina}>
        <span className={css.icono}>
          <Icono nombre="hourglass_top" tamano={36} />
        </span>
        <h1 className={css.titulo}>Listo, {tienda.nombre} lo está revisando</h1>
        <p className={css.texto}>Te avisamos por WhatsApp cuando lo aprueben.</p>
        {pedido ? (
          <Tarjeta className={css.resumen}>
            <span className={css.numero}>Pedido #{pedido.numero}</span>
            <span>{plata(pedido.sena || pedido.total)}</span>
          </Tarjeta>
        ) : null}
        <Aviso>Si algún dato no coincide, te escriben antes de prepararlo.</Aviso>
        <Boton variante="principal" tamano="lg" anchoCompleto to={`/pedido/${token}`}>
          Ver mi pedido
        </Boton>
      </Pagina>
    </>
  );
}
