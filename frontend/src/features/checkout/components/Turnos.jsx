import { horaTexto } from '../lib/agenda.js';
import css from './Turnos.module.css';

// Horarios del día elegido, de a 30 minutos.
export function Turnos({ turnos, elegido, onElegir }) {
  if (!turnos.length)
    return <p className={css.vacio}>Elegí un día para ver los horarios.</p>;
  return (
    <div className={css.grilla} role="group" aria-label="Horario de retiro o entrega">
      {turnos.map((t) => (
        <button
          key={t.getTime()}
          type="button"
          className={css.turno}
          aria-pressed={elegido?.getTime() === t.getTime()}
          onClick={() => onElegir(t)}
        >
          {horaTexto(t)}
        </button>
      ))}
    </div>
  );
}
