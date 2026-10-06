import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { useVaciarAlLlegar } from '../../carrito/useVaciarAlLlegar.js';
import { HeaderTienda } from '../../tienda/components/HeaderTienda.jsx';
import { AvisoPlazo } from '../components/AvisoPlazo.jsx';
import { DatosTransferencia } from '../components/DatosTransferencia.jsx';
import { SubirComprobante } from '../components/SubirComprobante.jsx';
import { usePedidoPublico } from '../hooks/usePedidoPublico.js';
import { useSubirComprobante } from '../hooks/useSubirComprobante.js';

// Pago por transferencia y subida del comprobante (Stitch 18 y 21).
export function PantallaPago() {
  const { token } = useParams();
  useVaciarAlLlegar();
  const { pedido, cargando } = usePedidoPublico(token);
  const { subir, enviando, error } = useSubirComprobante();
  const [archivo, setArchivo] = useState(null);
  const navegar = useNavigate();
  if (cargando) return <Esqueleto filas={5} />;
  if (!pedido?.pago) return <Navigate to={`/pedido/${token}`} replace />;
  async function enviar() {
    if ((await subir(token, archivo)).ok) navegar(`/pedido/${token}/listo`);
  }
  return (
    <>
      <HeaderTienda volver={`/pedido/${token}`} titulo={`Pedido #${pedido.numero}`} />
      <Pagina>
        <TituloPagina
          titulo="Pago de tu pedido"
          bajada="Transferí y subí el comprobante para que lo preparen."
        />
        <AvisoPlazo hasta={pedido.venceComprobanteEn} />
        <DatosTransferencia
          monto={pedido.pago.monto}
          alias={pedido.pago.alias}
          titular={pedido.pago.titular}
        />
        <Tarjeta>
          <SubirComprobante archivo={archivo} onArchivo={setArchivo} />
        </Tarjeta>
        <AvisoError error={error} />
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          disabled={!archivo}
          cargando={enviando}
          onClick={enviar}
        >
          Enviar comprobante
        </Boton>
      </Pagina>
    </>
  );
}
