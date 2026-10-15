import { NavLink } from 'react-router';
import {
  conPastilla,
  PastillaActiva,
} from '../../../shared/movimiento/PastillaActiva.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './NavClub.module.css';

const PESTANAS = [
  { a: '/club/qr', texto: 'Mi QR', icono: 'qr_code_2' },
  { a: '/club/tiendas', texto: 'Mis tiendas', icono: 'storefront' },
  { a: '/club/datos', texto: 'Mis datos', icono: 'person' },
];

// Barra inferior del Club: la pestaña activa con el fondo que se desliza.
export function NavClub() {
  return (
    <nav className={css.nav} aria-label="Secciones del Club">
      {PESTANAS.map((p) => (
        <NavLink key={p.a} to={p.a} className={css.pestana}>
          {({ isActive }) => (
            <>
              <span className={`${css.icono} ${conPastilla}`}>
                {isActive ? <PastillaActiva grupo="pestanaClub" /> : null}
                <Icono nombre={p.icono} />
              </span>
              {p.texto}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
