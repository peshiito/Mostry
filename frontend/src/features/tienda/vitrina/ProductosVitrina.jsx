import { useRef } from 'react';
import { TarjetaVitrina } from './TarjetaVitrina.jsx';
import css from './ProductosVitrina.module.css';
import { useAvanceSolo } from './useAvanceSolo.js';

// Destacados en carrusel (que puede avanzar solo) o el catálogo en grilla.
export function ProductosVitrina({ productos, carrusel, automatico }) {
  const lista = useRef(null);
  useAvanceSolo(lista, carrusel && automatico);
  return (
    <ul
      ref={lista}
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
