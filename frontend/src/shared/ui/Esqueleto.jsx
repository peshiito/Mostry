import css from './Esqueleto.module.css';

// Bloques grises mientras carga (nunca un spinner a pantalla completa).
export function Esqueleto({ filas = 4, alto = 64 }) {
  return (
    <div className={css.lista} aria-busy="true" aria-label="Cargando">
      {Array.from({ length: filas }, (_, i) => (
        <span key={i} className={css.bloque} style={{ height: alto }} />
      ))}
    </div>
  );
}
