import css from './Etiqueta.module.css';

// Etiqueta de estado: siempre con texto, el color solo acompaña.
// tono: verde · mostaza · ladrillo · gris · coral · ok
export function Etiqueta({ tono = 'gris', punto, mayus, children }) {
  return (
    <span className={`${css.etiqueta} ${css[tono]} ${mayus ? css.mayus : ''}`}>
      {punto ? <span className={css.punto} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
