import { NavLink } from 'react-router';
import {
  conPastilla,
  PastillaActiva,
} from '../../../shared/movimiento/PastillaActiva.jsx';
import css from './NavSoporte.module.css';

const SECCIONES = [
  ['productos', 'Productos'],
  ['categorias', 'Categorías'],
  ['horarios', 'Horarios'],
  ['tienda', 'Datos de la tienda'],
];

// Lo único que se puede tocar en modo soporte (la API tampoco deja otra cosa).
export function NavSoporte({ base }) {
  return (
    <nav aria-label="Secciones del modo soporte" className={css.nav}>
      {SECCIONES.map(([ruta, texto]) => (
        <NavLink
          key={ruta}
          to={`${base}/${ruta}`}
          className={`${css.item} ${conPastilla}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <PastillaActiva grupo="navSoporte" /> : null}
              <span>{texto}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
