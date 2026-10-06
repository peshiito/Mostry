import { Monto } from '../../../shared/ui/Monto.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';
import { plata } from '../../../shared/lib/plata.js';
import css from './ResumenGastos.module.css';

export function ResumenGastos({ total, gastos, inversiones }) {
  return (
    <Tarjeta className={css.tarjeta}>
      <span className={css.etiqueta}>Gastaste este mes</span>
      <Monto centavos={total} tamano="xl" />
      <Ticket>
        <TicketFila concepto="Gastos (insumos, servicios)" monto={plata(gastos)} />
        <TicketFila concepto="Inversiones" monto={plata(inversiones)} />
      </Ticket>
    </Tarjeta>
  );
}
