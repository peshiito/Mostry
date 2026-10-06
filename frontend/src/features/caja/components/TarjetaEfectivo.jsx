import { plata } from '../../../shared/lib/plata.js';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';
import css from './TarjetaEfectivo.module.css';

// Efectivo que debería haber en el cajón, con la cuenta a la vista.
export function TarjetaEfectivo({ caja, esperado }) {
  return (
    <Tarjeta className={css.tarjeta}>
      <span className={css.etiqueta}>Efectivo en caja</span>
      <Monto centavos={esperado} tamano="xl" />
      <Ticket>
        <TicketFila concepto="Apertura" monto={plata(caja.apertura)} />
        <TicketFila
          concepto="Ingresos en efectivo"
          monto={`+${plata(caja.ingresosEfectivo)}`}
          tono="ingreso"
        />
        <TicketFila
          concepto="Egresos en efectivo"
          monto={`−${plata(caja.egresosEfectivo)}`}
          tono="egreso"
        />
        {caja.depositos ? (
          <TicketFila
            concepto="Depósitos al banco"
            monto={`−${plata(caja.depositos)}`}
            tono="egreso"
          />
        ) : null}
      </Ticket>
    </Tarjeta>
  );
}
