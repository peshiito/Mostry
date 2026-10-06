import css from './Toldo.module.css';

// Remate festoneado del toldo. SOLO debajo del header de la tienda y del sitio.
export function Toldo() {
  return <div className={css.toldo} aria-hidden="true" />;
}
