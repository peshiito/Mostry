import { plata } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';

// Aviso arriba del seguimiento: pedido cancelado, o (Encargos 2) encargo que
// espera que la tienda lo acepte. Con seña, se paga recién ahí.
export function AvisoEstado({ pedido, tienda }) {
  if (pedido.estado === 'cancelado')
    return (
      <Aviso tipo="error" titulo="Pedido cancelado">
        Si tenés dudas, escribile a la tienda.
      </Aviso>
    );
  if (pedido.tipo !== 'encargo' || pedido.estado !== 'pendiente_confirmacion')
    return null;
  return (
    <Aviso titulo={`Esperando que ${tienda} acepte tu encargo`}>
      {pedido.sena
        ? `Te avisamos por WhatsApp. Cuando lo acepte, pagás la seña de ${plata(pedido.sena)}.`
        : 'Te avisamos por WhatsApp cuando lo acepte.'}
    </Aviso>
  );
}
