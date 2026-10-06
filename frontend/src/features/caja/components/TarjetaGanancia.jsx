import { plata } from '../../../shared/lib/plata.js';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';
import { gananciaReal } from '../lib/calculos.js';
import css from './TarjetaEfectivo.module.css';

// Ganancia real = ingresos − devoluciones − gastos (6.4). Las inversiones no restan.
export function TarjetaGanancia({ resumen: r }) {
  return (
    <Tarjeta className={css.tarjeta}>
      <span className={css.etiqueta}>Ganancia real</span>
      <Monto centavos={r.gananciaReal ?? gananciaReal(r)} tamano="xl" tono="verde" />
      <Ticket>
        <TicketFila concepto="Ingresos por ventas" monto={plata(r.ingresos)} />
        <TicketFila
          concepto="Devoluciones"
          monto={`−${plata(r.devoluciones)}`}
          tono="egreso"
        />
        <TicketFila concepto="Gastos" monto={`−${plata(r.gastos)}`} tono="egreso" />
        {r.inversiones ? (
          <TicketFila concepto="Inversiones (no restan)" monto={plata(r.inversiones)} />
        ) : null}
      </Ticket>
    </Tarjeta>
  );
}
