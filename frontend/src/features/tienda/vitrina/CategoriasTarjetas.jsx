import { Link } from 'react-router';
import { FotoProducto } from '../../../shared/ui/FotoProducto.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { fotoDeCategoria } from '../lib/fotoDeCategoria.js';
import css from './CategoriasTarjetas.module.css';

// Categorías como tarjetas grandes con foto, nombre y cuántos productos tiene
// (como el "Hombre / Mujer / Niños" de las tiendas de ropa).
export function CategoriasTarjetas({ categorias, productos }) {
  if (!categorias.length) return null;
  return (
    <ul className={css.grilla} data-v="categorias-tarjetas">
      {categorias.map((c) => (
        <li key={c.id}>
          <Link
            to={`/catalogo?categoria=${c.id}`}
            className={css.tarjeta}
            data-v="categoria-tarjeta"
          >
            <FotoProducto
              src={fotoDeCategoria(c, productos)}
              nombre={c.nombre}
              className={css.foto}
              loading="lazy"
            />
            <span className={css.textos}>
              <span className={css.nombre}>{c.nombre}</span>
              <span className={css.cuenta}>
                {c.cantidad} {c.cantidad === 1 ? 'producto' : 'productos'}
              </span>
              <span className={css.ver}>
                Ver <Icono nombre="arrow_forward" tamano={16} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
