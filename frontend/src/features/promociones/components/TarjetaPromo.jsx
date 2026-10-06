import { fechaCorta } from '../../../shared/lib/fechas.js';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './TarjetaPromo.module.css';

const f = (d) => fechaCorta(`${d}T15:00:00Z`);

export function TarjetaPromo({ promo: p, onAlternar }) {
  const estado = p.vencida
    ? ['gris', 'Vencida']
    : p.programada
      ? ['mostaza', 'Programada']
      : p.activa
        ? ['ok', 'En la tienda']
        : ['gris', 'Pausada'];
  return (
    <Tarjeta className={`${css.promo} ${p.vencida ? css.vencida : ''}`}>
      <div className={css.cabeza}>
        <h2 className={css.titulo}>{p.titulo}</h2>
        <Etiqueta tono={estado[0]}>{estado[1]}</Etiqueta>
      </div>
      <p>{p.descripcion}</p>
      <p className={css.vigencia}>
        Del {f(p.desde)} al {f(p.hasta)}
      </p>
      {p.vencida ? null : (
        <Interruptor etiqueta="Activa" activo={p.activa} onCambio={onAlternar} />
      )}
    </Tarjeta>
  );
}
