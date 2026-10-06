import { Link } from 'react-router';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './AccesosCategorias.module.css';

// Accesos a las categorías del catálogo.
export function AccesosCategorias({ categorias }) {
  return (
    <nav aria-label="Categorías">
      <ul className={css.grilla}>
        {categorias.map((c) => (
          <li key={c.id}>
            <Link to={`/catalogo?categoria=${c.id}`} className={css.acceso}>
              <span className={css.icono}>
                <Icono nombre={c.icono} />
              </span>
              <span className={css.nombre}>{c.nombre}</span>
              <span className={css.cantidad}>
                {c.cantidad} {c.cantidad === 1 ? 'producto' : 'productos'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
