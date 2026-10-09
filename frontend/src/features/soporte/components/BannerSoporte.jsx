import { Link } from 'react-router';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { hora } from '../../../shared/lib/fechas.js';
import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './BannerSoporte.module.css';

// En el panel del comercio, mientras Mostry tiene permiso de soporte.
export function BannerSoporte() {
  const { datos } = useConsulta('/panel/soporte');
  if (!datos?.acceso) return null;
  return (
    <Link to="/panel/soporte" className={css.banner}>
      <Icono nombre="shield_person" tamano={18} />
      <span>Mostry tiene acceso de soporte hasta las {hora(datos.acceso.venceEn)}</span>
      <Icono nombre="chevron_right" tamano={18} />
    </Link>
  );
}
