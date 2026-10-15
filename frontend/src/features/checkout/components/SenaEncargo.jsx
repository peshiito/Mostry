import { plata } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';

// Seña opcional (6.2): se paga cuando la tienda acepta el encargo (Encargos 2);
// el resto, al retirar.
export function SenaEncargo({ sena, total, porcentaje }) {
  if (!sena)
    return <Aviso>La tienda lo revisa y te avisa por WhatsApp cuando lo acepta.</Aviso>;
  return (
    <Tarjeta tono="mostaza">
      <Ticket titulo={`Seña del ${porcentaje} %`}>
        <TicketFila concepto="Cuando la tienda lo acepte" monto={plata(sena)} />
        <TicketFila concepto="Al retirar" monto={plata(total - sena)} />
      </Ticket>
    </Tarjeta>
  );
}
