import { FilasEsqueleto } from './EsqueletoLista.jsx';
import { Cargando, Hueso } from './Hueso.jsx';
import css from './esqueletos.module.css';

// Tarjetas con números arriba (ventas, caja, métricas) y una lista abajo.
export function EsqueletoResumen({ numeros = 3, filas = 3 }) {
  return (
    <Cargando className={css.caja}>
      <Hueso ancho="50%" alto={28} />
      <div className={css.numeros}>
        {Array.from({ length: numeros }, (_, i) => (
          <div key={i} className={`${css.tarjeta} ${css.numero}`}>
            <Hueso ancho="60%" alto={12} />
            <Hueso ancho="80%" alto={28} />
          </div>
        ))}
      </div>
      {filas ? <FilasEsqueleto filas={filas} /> : null}
    </Cargando>
  );
}
