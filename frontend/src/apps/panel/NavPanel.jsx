import { NavLink } from 'react-router';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { Icono } from '../../shared/ui/Icono.jsx';
import css from './NavPanel.module.css';

const PESTANAS = [
  { a: '/panel', texto: 'Inicio', icono: 'home', fin: true },
  { a: '/panel/pedidos', texto: 'Pedidos', icono: 'receipt_long', porAprobar: true },
  { a: '/panel/caja', texto: 'Caja', icono: 'point_of_sale' },
  { a: '/panel/productos', texto: 'Productos', icono: 'inventory_2' },
  { a: '/panel/mas', texto: 'Más', icono: 'more_horiz' },
];

// Barra de pestañas inferior (5 como máximo).
export function NavPanel() {
  const porAprobar =
    useConsulta('/panel/pedidos?estado=comprobante_enviado').datos?.total ?? 0;
  return (
    <nav className={css.nav} aria-label="Secciones del panel">
      {PESTANAS.map((p) => (
        <NavLink key={p.a} to={p.a} end={p.fin} className={css.pestana}>
          <span className={css.icono}>
            <Icono nombre={p.icono} />
            {p.porAprobar && porAprobar ? (
              <span className={css.insignia} aria-label={`${porAprobar} por aprobar`}>
                {porAprobar}
              </span>
            ) : null}
          </span>
          {p.texto}
        </NavLink>
      ))}
    </nav>
  );
}
