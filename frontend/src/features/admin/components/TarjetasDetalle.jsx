import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Seccion } from '../../../shared/ui/Seccion.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { Ticket, TicketFila } from '../../../shared/ui/Ticket.jsx';
import css from './TarjetasDetalle.module.css';

// Datos, uso y pagos registrados de una tienda (GET /admin/tiendas/:id).
export function TarjetasDetalle({ tienda: t }) {
  return (
    <div className={css.grilla}>
      <Seccion titulo="Datos">
        <Tarjeta>
          <Ticket>
            <TicketFila concepto="Titular" monto={t.duena || '—'} />
            <TicketFila concepto="Email" monto={t.email || '—'} />
            <TicketFila concepto="Alta" monto={fechaCorta(t.alta)} />
            <TicketFila concepto="Vence" monto={t.vence ? fechaCorta(t.vence) : '—'} />
          </Ticket>
        </Tarjeta>
      </Seccion>
      <Seccion titulo="Uso">
        <Tarjeta>
          <Ticket>
            <TicketFila concepto="Productos" monto={t.productos ?? 0} />
            <TicketFila concepto="Pedidos" monto={t.pedidos ?? 0} />
          </Ticket>
        </Tarjeta>
      </Seccion>
      <Seccion titulo="Pagos">
        <Tarjeta>
          {t.pagos.length ? (
            <Ticket>
              {t.pagos.map((p) => (
                <TicketFila
                  key={p.id}
                  concepto={fechaCorta(`${p.pagadoEn}T15:00:00Z`)}
                  detalle={`Cubre hasta el ${fechaCorta(p.periodoHasta)}`}
                  monto={plata(p.monto)}
                />
              ))}
            </Ticket>
          ) : (
            <p className={css.vacio}>Sin pagos registrados.</p>
          )}
        </Tarjeta>
      </Seccion>
    </div>
  );
}
