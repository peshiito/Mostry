import { useState } from 'react';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { diasDelMes } from '../lib/agenda.js';
import css from './Calendario.module.css';

const SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const mismoDia = (a, b) => a && b && a.toDateString() === b.toDateString();

// Calendario mensual. `disponible(fecha)` decide qué días se pueden elegir.
export function Calendario({ elegido, onElegir, disponible }) {
  const hoy = new Date();
  const [mes, setMes] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() });
  const mesTexto = new Date(mes.anio, mes.mes).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });
  const titulo = mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1);
  const mover = (d) =>
    setMes(({ anio, mes: m }) => ({
      anio: anio + Math.floor((m + d) / 12),
      mes: (m + d + 12) % 12,
    }));
  return (
    <div className={css.calendario}>
      <div className={css.cabeza}>
        <h3 className={css.titulo}>{titulo}</h3>
        <BotonIcono
          icono="chevron_left"
          etiqueta="Mes anterior"
          tono="borde"
          onClick={() => mover(-1)}
        />
        <BotonIcono
          icono="chevron_right"
          etiqueta="Mes siguiente"
          tono="borde"
          onClick={() => mover(1)}
        />
      </div>
      <div className={css.grilla}>
        {SEMANA.map((d) => (
          <span key={d} className={css.semana}>
            {d}
          </span>
        ))}
        {diasDelMes(mes.anio, mes.mes).map((f, i) =>
          f ? (
            <button
              key={i}
              type="button"
              className={css.dia}
              disabled={!disponible(f)}
              aria-pressed={mismoDia(f, elegido)}
              aria-label={f.toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
              onClick={() => onElegir(f)}
            >
              {f.getDate()}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
}
