import { Link } from 'react-router';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './AccesosDia.module.css';
import { Contador } from '../../../shared/movimiento/Contador.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';

// Accesos rápidos: por aprobar, encargos de mañana y caja (solo lo que la tienda
// usa, según "Qué uso de Mostry").
export function AccesosDia({ porAprobar, encargosManana, cajaAbierta }) {
  const { tienda } = usePanel();
  const todos = [
    {
      a: '/panel/pedidos',
      n: porAprobar,
      texto: 'Por aprobar',
      icono: 'pending',
      urgente: porAprobar > 0,
    },
    { a: '/panel/encargos', n: encargosManana, texto: 'Encargos mañana', icono: 'cake' },
    {
      a: '/panel/caja',
      n: null,
      texto: cajaAbierta ? 'Caja abierta' : 'Caja sin abrir',
      icono: 'point_of_sale',
    },
  ];
  const items = todos.filter(
    (i) =>
      (i.a !== '/panel/pedidos' || tienda.vendeOnline !== false || porAprobar > 0) &&
      (i.a !== '/panel/encargos' || tienda.usaEncargos !== false),
  );
  return (
    <ul className={css.grilla}>
      {items.map((i) => (
        <li key={i.a}>
          <Link to={i.a} className={`${css.acceso} ${i.urgente ? css.urgente : ''}`}>
            <Icono nombre={i.icono} />
            {i.n != null ? (
              <span className={css.numero}>
                <Contador valor={i.n} />
              </span>
            ) : null}
            <span className={css.texto}>{i.texto}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
