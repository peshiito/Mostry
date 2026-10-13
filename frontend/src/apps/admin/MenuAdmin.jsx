import { NavLink } from 'react-router';
import { conPastilla, PastillaActiva } from '../../shared/movimiento/PastillaActiva.jsx';
import { Icono } from '../../shared/ui/Icono.jsx';
import css from './LayoutAdmin.module.css';
import cel from './LayoutAdminCelular.module.css';

const SECCIONES = [
  { a: '/', texto: 'Tiendas', icono: 'storefront', fin: true },
  { a: '/reportes', texto: 'Reportes', icono: 'support_agent' },
  { a: '/mensajes', texto: 'Mensajes', icono: 'chat' },
  { a: '/metricas', texto: 'Métricas', icono: 'bar_chart' },
];

// Secciones del admin: el fondo de la elegida se desliza a la nueva.
export function MenuAdmin() {
  return (
    <nav aria-label="Administración" className={`${css.nav} ${cel.nav}`}>
      {SECCIONES.map((s) => (
        <NavLink key={s.a} to={s.a} end={s.fin} className={`${css.item} ${conPastilla}`}>
          {({ isActive }) => (
            <>
              {isActive ? (
                <PastillaActiva grupo="menuAdmin" className={css.pastilla} />
              ) : null}
              <Icono nombre={s.icono} /> <span>{s.texto}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
