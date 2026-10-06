import { plata } from '../../../shared/lib/plata.js';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';

// Resumen tipo ticket. Es orientativo: el servidor recalcula precios y total (6.1).
export function ResumenCompra({ items, costoEnvio }) {
  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  return (
    <Tarjeta>
      <Ticket titulo="Resumen">
        {items.map((i) => (
          <TicketFila
            key={i.id}
            concepto={`${i.cantidad} × ${i.nombre}`}
            monto={plata(i.precio * i.cantidad)}
          />
        ))}
        {costoEnvio ? <TicketFila concepto="Envío" monto={plata(costoEnvio)} /> : null}
        <TicketFila concepto="Total" monto={plata(subtotal + (costoEnvio ?? 0))} total />
      </Ticket>
    </Tarjeta>
  );
}
