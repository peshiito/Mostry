import { Link } from 'react-router';
import { Icono } from './Icono.jsx';
import base from './Boton.module.css';
import extras from './BotonExtras.module.css';

const css = { ...base, ...extras };

// variante: principal (coral, UNO por pantalla) · verde · secundario · texto · peligro.
export function Boton({
  variante = 'secundario',
  tamano = 'md',
  icono,
  iconoFin,
  anchoCompleto,
  cargando,
  to,
  href,
  className = '',
  children,
  ...resto
}) {
  const clases = [
    css.boton,
    css[variante],
    css[tamano],
    anchoCompleto ? css.ancho : '',
    className,
  ].join(' ');
  const contenido = (
    <>
      {cargando ? <span className={css.ruedita} aria-hidden="true" /> : null}
      {!cargando && icono ? <Icono nombre={icono} tamano={20} /> : null}
      <span>{children}</span>
      {iconoFin ? <Icono nombre={iconoFin} tamano={20} /> : null}
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className={clases}
        target="_blank"
        rel="noopener noreferrer"
        {...resto}
      >
        {contenido}
      </a>
    );
  }
  if (to) {
    return (
      <Link to={to} className={clases} {...resto}>
        {contenido}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={clases}
      disabled={cargando || resto.disabled}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {contenido}
    </button>
  );
}
