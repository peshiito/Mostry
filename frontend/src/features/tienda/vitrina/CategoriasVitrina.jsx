import { Link } from 'react-router';
import { FotoProducto } from '../../../shared/ui/FotoProducto.jsx';
import css from './CategoriasVitrina.module.css';

// Categorías con la foto de uno de sus productos (o sus iniciales). Cada
// estilo las muestra distinto: fichas, burbujas o pestañas de texto.
export function CategoriasVitrina({ categorias, productos }) {
  if (!categorias.length) return null;
  const fotoDe = (c) =>
    productos.find((p) => p.categoriaId === c.id && !p.foto.endsWith('/sin-foto.svg'))
      ?.foto;
  return (
    <nav aria-label="Categorías" className={css.nav} data-v="categorias">
      <ul className={css.lista}>
        {categorias.map((c) => (
          <li key={c.id}>
            <Link
              to={`/catalogo?categoria=${c.id}`}
              className={css.ficha}
              data-v="categoria"
            >
              <FotoProducto src={fotoDe(c)} nombre={c.nombre} className={css.foto} />
              <span className={css.nombre} data-v="categoria-nombre">
                {c.nombre}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
