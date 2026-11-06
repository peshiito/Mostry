import { ImagenSuave } from './ImagenSuave.jsx';
import css from './FotoProducto.module.css';

const iniciales = (nombre = '') =>
  nombre
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || nombre.slice(0, 1).toUpperCase();

// Foto del producto, o (si todavía no tiene) un cuadro con sus iniciales en los
// colores y la letra del tema: nunca la bolsa gris (Vidriera 2.0, V4).
export function FotoProducto({ src, nombre, className = '', alt = '', ...resto }) {
  if (src && !src.endsWith('/sin-foto.svg'))
    return <ImagenSuave src={src} alt={alt} className={className} {...resto} />;
  return (
    <span
      className={`${className} ${css.sinFoto}`}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : 'true'}
    >
      <svg viewBox="0 0 100 100" className={css.letras}>
        <text x="50" y="54" textAnchor="middle" dominantBaseline="middle">
          {iniciales(nombre)}
        </text>
      </svg>
    </span>
  );
}
