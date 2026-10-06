import css from './Lista.module.css';

// Contenedor de filas con borde y esquinas redondeadas.
export function Lista({ children }) {
  return <div className={css.lista}>{children}</div>;
}
