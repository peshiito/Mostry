import css from './Miniatura.module.css';

// Foto cuadrada chica para filas (decorativa: el nombre va al lado).
export function Miniatura({ src, tamano = 48 }) {
  return (
    <img
      src={src}
      alt=""
      width={tamano}
      height={tamano}
      className={css.miniatura}
      loading="lazy"
    />
  );
}
