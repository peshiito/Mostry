import { plata } from '../../../shared/lib/plata.js';
import { Aviso } from '../../../shared/ui/Aviso.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';

// Seña opcional (6.2): lo que se paga ahora y lo que queda para la entrega.
export function SenaEncargo({ sena, total, porcentaje }) {
  if (!sena) return <Aviso>Te confirmamos el encargo por WhatsApp.</Aviso>;
  return (
    <Tarjeta tono="mostaza">
      <Ticket titulo={`Seña del ${porcentaje} %`}>
        <TicketFila concepto="Ahora" monto={plata(sena)} />
        <TicketFila concepto="Al retirar" monto={plata(total - sena)} />
      </Ticket>
    </Tarjeta>
  );
}
