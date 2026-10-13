import { Link } from 'react-router';
import { ContenidoBoton } from './ContenidoBoton.jsx';
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
  textoCargando,
  textoHecho,
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
    cargando ? css.cargando : '',
    className,
  ].join(' ');
  const props = { icono, iconoFin, cargando, textoCargando, textoHecho };
  const contenido = <ContenidoBoton {...props}>{children}</ContenidoBoton>;
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
      {...resto}
      disabled={cargando || resto.disabled}
      aria-busy={cargando || undefined}
    >
      {contenido}
    </button>
  );
}
