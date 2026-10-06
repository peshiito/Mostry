import { Link } from 'react-router';
import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plural } from '../../../shared/lib/texto.js';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { useSuscripcion } from '../hooks/useSuscripcion.js';
import css from './BannerSuscripcion.module.css';

// Banner fijo arriba del panel según el estado del plan (prueba, gracia, suspendida).
export function BannerSuscripcion() {
  const s = useSuscripcion();
  if (s.estado === 'activa') return null;
  const textos = {
    prueba: `Te quedan ${plural(s.diasRestantes, 'día', 'días')} de prueba`,
    gracia: `Tu plan venció. Pagá antes del ${fechaCorta(s.finGracia ?? s.planHasta)} para no perder la tienda`,
    suspendida: 'Tienda suspendida · el panel queda en solo lectura',
  };
  return (
    <div className={`${css.banner} ${css[s.estado]}`} role="status">
      <Icono nombre={s.estado === 'suspendida' ? 'lock' : 'info'} tamano={20} />
      <span className={css.texto}>{textos[s.estado]}</span>
      <Link to="/panel/suscripcion" className={css.link}>
        Pagar
      </Link>
    </div>
  );
}
