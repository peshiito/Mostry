import * as m from 'motion/react-m';
import { NavLink } from 'react-router';
import { useConsulta } from '../../shared/api/useConsulta.js';
import { usePanel } from '../../features/panelBase/PanelContexto.jsx';
import { conPastilla, PastillaActiva } from '../../shared/movimiento/PastillaActiva.jsx';
import { RESORTES } from '../../shared/movimiento/resortes.js';
import { Icono } from '../../shared/ui/Icono.jsx';
import { Insignia } from './InsigniaPanel.jsx';
import css from './NavPanel.module.css';

const VENDER = { a: '/panel/vender', texto: 'Vender', icono: 'shopping_bag' };
const PESTANAS = [
  { a: '/panel', texto: 'Inicio', icono: 'home', fin: true },
  { a: '/panel/pedidos', texto: 'Pedidos', icono: 'receipt_long', porAprobar: true },
  { a: '/panel/caja', texto: 'Caja', icono: 'point_of_sale' },
  { a: '/panel/productos', texto: 'Productos', icono: 'inventory_2' },
  { a: '/panel/mas', texto: 'Más', icono: 'more_horiz' },
];

// Para que la pantalla nueva entre desde el lado de su pestaña.
export const ORDEN_PESTANAS = [...PESTANAS.map((p) => p.a), VENDER.a];

const ELEVADA = { y: -3, scale: 1.08 };
const EN_REPOSO = { y: 0, scale: 1 };

// Barra de pestañas inferior (5 como máximo). La pestaña activa se eleva y su
// fondo se desliza desde la anterior; al tocar, se hunde y rebota.
export function NavPanel() {
  const { tienda } = usePanel();
  const online = tienda.vendeOnline !== false;
  const porAprobar =
    useConsulta('/panel/pedidos?estado=comprobante_enviado').datos?.total ?? 0;
  // Sin venta online, la pestaña de pedidos es "Vender" (Mejoras 3 C), salvo que
  // queden pedidos por aprobar de antes: esos no pueden quedar sin dueño.
  const conPedidos = online || porAprobar > 0;
  const pestanas = conPedidos
    ? PESTANAS
    : PESTANAS.map((p) => (p.porAprobar ? VENDER : p));
  return (
    <nav className={css.nav} aria-label="Secciones del panel">
      {pestanas.map((p) => (
        <NavLink key={p.a} to={p.a} end={p.fin} className={css.pestana}>
          {({ isActive }) => (
            <>
              <m.span
                className={`${css.icono} ${conPastilla}`}
                animate={isActive ? ELEVADA : EN_REPOSO}
                whileTap={{ scale: 0.9 }}
                transition={RESORTES.rapido}
              >
                {isActive ? <PastillaActiva grupo="pestanaPanel" /> : null}
                <Icono nombre={p.icono} />
                {p.porAprobar && porAprobar ? <Insignia n={porAprobar} /> : null}
              </m.span>
              {p.texto}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
