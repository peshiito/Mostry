import { plata } from '../../../shared/lib/plata.js';
import { textoPremio } from '../../club/lib/textoPremio.js';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';

// Ticket del pedido con nombre y precio copiados al momento de la compra.
export function DetallePedido({ pedido }) {
  return (
    <Tarjeta>
      <Ticket titulo={`Detalle del pedido #${pedido.numero}`}>
        {pedido.items.map((i) => (
          <TicketFila
            key={i.id}
            concepto={`${i.cantidad} × ${i.nombre}`}
            detalle={i.personalizacion ? `“${i.personalizacion}”` : undefined}
            monto={plata(i.precio * i.cantidad)}
          />
        ))}
        {pedido.premio ? (
          <TicketFila
            concepto="Premio del Club"
            detalle={textoPremio(pedido.premio)}
            monto={pedido.descuento ? `− ${plata(pedido.descuento)}` : plata(0)}
          />
        ) : null}
        {pedido.costoEnvio ? (
          <TicketFila
            concepto="Envío"
            detalle={pedido.direccion}
            monto={plata(pedido.costoEnvio)}
          />
        ) : null}
        <TicketFila concepto="Total" monto={plata(pedido.total)} total />
        {pedido.sena ? (
          <>
            <TicketFila concepto="Seña" monto={plata(pedido.sena)} />
            <TicketFila
              concepto="Resta pagar al retirar"
              monto={plata(pedido.total - pedido.sena)}
            />
          </>
        ) : null}
      </Ticket>
    </Tarjeta>
  );
}
