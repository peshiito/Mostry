import { NavLink } from 'react-router';
import css from './PestanasLibreta.module.css';

export function PestanasLibreta() {
  return (
    <nav className={css.pestanas} aria-label="Libreta">
      <NavLink to="/panel/libreta" end className={css.pestana}>
        Clientes
      </NavLink>
      <NavLink to="/panel/libreta/notas" className={css.pestana}>
        Notas
      </NavLink>
    </nav>
  );
}
