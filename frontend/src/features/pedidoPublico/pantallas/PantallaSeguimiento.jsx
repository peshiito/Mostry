import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';
import { useParams } from 'react-router';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { useVaciarAlLlegar } from '../../carrito/useVaciarAlLlegar.js';
import { HeaderTienda } from '../../tienda/components/HeaderTienda.jsx';
import { useTienda } from '../../tienda/hooks/useTienda.js';
import { CabeceraPedido } from '../components/CabeceraPedido.jsx';
import { DetallePedido } from '../components/DetallePedido.jsx';
import { LineaTiempo } from '../components/LineaTiempo.jsx';
import { usePedidoPublico } from '../hooks/usePedidoPublico.js';

// Seguimiento por link único sin login (Stitch 20). Funciona con la tienda cerrada.
export function PantallaSeguimiento() {
  const { token } = useParams();
  useVaciarAlLlegar();
  const { pedido, cargando } = usePedidoPublico(token);
  const { tienda } = useTienda();
  if (cargando) return <Esqueleto filas={5} />;
  if (!pedido)
    return (
      <Estado nivel={1} icono="search" titulo="No encontramos ese pedido">
        Revisá que el link esté completo.
      </Estado>
    );
  return (
    <>
      <HeaderTienda volver="/" titulo={tienda.nombre} />
      <Pagina>
        <CabeceraPedido pedido={pedido} />
        {pedido.estado === 'cancelado' ? (
          <Aviso tipo="error" titulo="Pedido cancelado">
            Si tenés dudas, escribile a la tienda.
          </Aviso>
        ) : (
          <Tarjeta>
            <LineaTiempo pedido={pedido} />
          </Tarjeta>
        )}
        {pedido.estado === 'pendiente_pago' ? (
          <Boton
            variante="principal"
            tamano="lg"
            anchoCompleto
            to={`/pedido/${token}/pago`}
          >
            {pedido.motivoRechazo
              ? 'Subir otro comprobante'
              : 'Pagar y subir comprobante'}
          </Boton>
        ) : null}
        <DetallePedido pedido={pedido} />
        <Boton icono="chat" href={linkWhatsapp(tienda.whatsapp) ?? undefined}>
          Escribirle a {tienda.nombre} por WhatsApp
        </Boton>
      </Pagina>
    </>
  );
}
