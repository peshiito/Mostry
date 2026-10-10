import { Link } from 'react-router';
import { urlSitio } from '../../../shared/lib/urls.js';
import { ZONA_ACTUAL } from '../../../shared/lib/zonaActual.js';
import { LogoMostry } from '../../../shared/ui/LogoMostry.jsx';
import css from './LayoutCuenta.module.css';

// Logo de las pantallas de cuenta (registro, ingreso, recuperar): lleva a la
// landing de Mostry, por si alguien quiere leer más antes de seguir. En el admin
// queda quieto (ahí no hay landing a la que volver).
export function LogoInicio() {
  const { zona } = ZONA_ACTUAL;
  if (zona === 'admin') return <LogoMostry />;
  const etiqueta = 'Ir al inicio de Mostry';
  return zona === 'sitio' ? (
    <Link to="/" className={css.logoLink} aria-label={etiqueta}>
      <LogoMostry />
    </Link>
  ) : (
    <a href={urlSitio('/')} className={css.logoLink} aria-label={etiqueta}>
      <LogoMostry />
    </a>
  );
}
