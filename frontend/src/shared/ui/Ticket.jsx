import css from './Ticket.module.css';

// Montos con estilo de ticket de caja: concepto ····· monto.
export function Ticket({ titulo, children }) {
  return (
    <div className={css.ticket}>
      {titulo ? <p className={css.titulo}>{titulo}</p> : null}
      <dl className={css.filas}>{children}</dl>
    </div>
  );
}

export function TicketFila({ concepto, detalle, monto, total, tono }) {
  return (
    <div className={`${css.fila} ${total ? css.total : ''}`}>
      <dt className={css.concepto}>
        {concepto}
        {detalle ? <span className={css.detalle}>{detalle}</span> : null}
      </dt>
      <span className={css.puntos} aria-hidden="true" />
      <dd className={`${css.monto} ${tono ? css[tono] : ''}`}>{monto}</dd>
    </div>
  );
}
