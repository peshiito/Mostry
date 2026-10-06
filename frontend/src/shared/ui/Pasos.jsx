import css from './Pasos.module.css';

// Indicador de pasos de un flujo (recuperar clave, encargo).
export function Pasos({ pasos, actual }) {
  return (
    <ol className={css.pasos} aria-label={`Paso ${actual} de ${pasos.length}`}>
      {pasos.map((p, i) => {
        const n = i + 1;
        const estado = n < actual ? css.hecho : n === actual ? css.actual : '';
        return (
          <li
            key={p}
            className={`${css.paso} ${estado}`}
            aria-current={n === actual ? 'step' : undefined}
          >
            <span className={css.barra} aria-hidden="true" />
            <span className={css.texto}>
              {n}. {p}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
