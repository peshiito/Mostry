import { Link } from 'react-router';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { useMinutosRestantes } from '../hooks/useMinutosRestantes.js';
import css from './FranjaSoporte.module.css';

// Siempre a la vista en modo soporte: de quién es la tienda que estás tocando,
// cuánto le queda al permiso y cómo salir.
export function FranjaSoporte({ tienda, venceEn, volver }) {
  const min = useMinutosRestantes(venceEn);
  return (
    <div className={css.franja} role="status">
      <Icono nombre="shield_person" tamano={20} />
      <p className={css.texto}>
        <strong>Modo soporte · {tienda}</strong>
        <span>
          {min > 0 ? `Quedan ${min} min · todo queda anotado` : 'El permiso venció'}
        </span>
      </p>
      <Link to={volver} className={css.salir}>
        Salir
      </Link>
    </div>
  );
}
