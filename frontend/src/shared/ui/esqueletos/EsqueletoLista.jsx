import { Cargando, Hueso } from './Hueso.jsx';
import css from './esqueletos.module.css';

// Filas de una lista: ícono o foto, dos líneas de texto y el monto a la derecha.
// `foto`: miniatura cuadrada (productos) en lugar del círculo (pedidos, clientes).
export function FilasEsqueleto({ filas = 5, foto, monto = true }) {
  return (
    <div className={css.tarjeta}>
      {Array.from({ length: filas }, (_, i) => (
        <div key={i} className={css.fila}>
          <Hueso ancho={foto ? 64 : 40} alto={foto ? 64 : 40} redondo={!foto} />
          <div className={css.textos}>
            <Hueso ancho={`${70 - (i % 3) * 12}%`} />
            <Hueso ancho="40%" alto={12} />
          </div>
          {monto ? <Hueso ancho={64} alto={18} /> : null}
        </div>
      ))}
    </div>
  );
}

export function EsqueletoLista({ filas, foto, monto, chips }) {
  return (
    <Cargando className={css.caja}>
      <Hueso ancho="45%" alto={28} />
      {chips ? (
        <div className={css.chips}>
          {[72, 96, 80, 64].map((a) => (
            <Hueso key={a} ancho={a} alto={36} />
          ))}
        </div>
      ) : null}
      <FilasEsqueleto filas={filas} foto={foto} monto={monto} />
    </Cargando>
  );
}

// Solo las filas, para una lista dentro de una pantalla que ya tiene su título.
export function EsqueletoFilas(props) {
  return (
    <Cargando>
      <FilasEsqueleto {...props} />
    </Cargando>
  );
}
