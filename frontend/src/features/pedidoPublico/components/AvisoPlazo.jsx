import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { useCuentaRegresiva } from '../hooks/useCuentaRegresiva.js';

// "Tenés 1:43 h para mandar el comprobante" (6.1).
export function AvisoPlazo({ hasta }) {
  const { texto, vencido } = useCuentaRegresiva(hasta);
  if (vencido) {
    return (
      <Aviso tipo="error" titulo="Venció el plazo">
        El pedido se canceló y los productos volvieron al mostrador.
      </Aviso>
    );
  }
  return (
    <Aviso
      tipo="alerta"
      titulo={`Tenés ${texto} para mandar el comprobante`}
      icono="timer"
    >
      Si no llega a tiempo, el pedido se cancela solo.
    </Aviso>
  );
}
