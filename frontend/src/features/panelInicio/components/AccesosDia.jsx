import { Link } from 'react-router';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './AccesosDia.module.css';

// Tres accesos rápidos: por aprobar, encargos de mañana y caja.
export function AccesosDia({ porAprobar, encargosManana, cajaAbierta }) {
  const items = [
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
  return (
    <ul className={css.grilla}>
      {items.map((i) => (
        <li key={i.a}>
          <Link to={i.a} className={`${css.acceso} ${i.urgente ? css.urgente : ''}`}>
            <Icono nombre={i.icono} />
            {i.n != null ? <span className={css.numero}>{i.n}</span> : null}
            <span className={css.texto}>{i.texto}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
