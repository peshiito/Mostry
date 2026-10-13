import { Cargando, Hueso } from './Hueso.jsx';
import css from './esqueletos.module.css';

// Filas de la tabla del admin (la pantalla ya muestra el título y el buscador).
export function EsqueletoTabla({ filas = 8 }) {
  return (
    <Cargando>
      <div className={css.tarjeta}>
        {Array.from({ length: filas }, (_, i) => (
          <div key={i} className={css.columnas}>
            <Hueso ancho={`${80 - (i % 3) * 15}%`} />
            <Hueso ancho={72} alto={24} />
            <Hueso ancho="70%" alto={14} />
            <Hueso ancho="50%" alto={14} />
          </div>
        ))}
      </div>
    </Cargando>
  );
}
