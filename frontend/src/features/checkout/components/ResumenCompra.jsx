import { plata } from '../../../shared/lib/plata.js';
import { calcularDescuento } from '../../club/lib/descuento.js';
import { textoPremio } from '../../club/lib/textoPremio.js';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';

// Resumen tipo ticket. Es orientativo: el servidor recalcula precios y total (6.1).
export function ResumenCompra({ items, costoEnvio, premio }) {
  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const descuento = calcularDescuento(premio, subtotal);
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
        {premio ? (
          <TicketFila
            concepto={`Premio del Club: ${textoPremio(premio)}`}
            monto={descuento ? `− ${plata(descuento)}` : plata(0)}
          />
        ) : null}
        {costoEnvio ? <TicketFila concepto="Envío" monto={plata(costoEnvio)} /> : null}
        <TicketFila
          concepto="Total"
          monto={plata(subtotal - descuento + (costoEnvio ?? 0))}
          total
        />
      </Ticket>
    </Tarjeta>
  );
}
