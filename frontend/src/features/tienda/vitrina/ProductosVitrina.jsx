import { TarjetaVitrina } from './TarjetaVitrina.jsx';
import css from './ProductosVitrina.module.css';

// Destacados en carrusel o el catálogo en grilla de dos columnas.
export function ProductosVitrina({ productos, carrusel }) {
  return (
    <ul
      className={carrusel ? css.carrusel : css.grilla}
      data-v={carrusel ? 'carrusel' : 'grilla'}
    >
      {productos.map((p) => (
        <li key={p.id}>
          <TarjetaVitrina producto={p} ancha={carrusel} />
        </li>
      ))}
    </ul>
  );
}
