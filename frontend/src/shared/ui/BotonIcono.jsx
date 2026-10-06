import { Link } from 'react-router';
import { Icono } from './Icono.jsx';
import css from './BotonIcono.module.css';

// Botón solo-ícono: el texto accesible es obligatorio.
export function BotonIcono({ icono, etiqueta, to, insignia, tono = 'neutro', ...resto }) {
  const clases = `${css.boton} ${css[tono]}`;
  const interior = (
    <>
      <Icono nombre={icono} />
      {insignia ? (
        <span key={insignia} className={css.insignia}>
          {insignia}
        </span>
      ) : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={clases} aria-label={etiqueta}>
        {interior}
      </Link>
    );
  }
  return (
    <button type="button" className={clases} aria-label={etiqueta} {...resto}>
      {interior}
    </button>
  );
}
