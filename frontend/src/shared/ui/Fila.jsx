import { Link } from 'react-router';
import { Icono } from './Icono.jsx';
import css from './Fila.module.css';

// Fila de lista densa: inicio (ícono/foto), textos, fin (monto/acción).
export function Fila({ to, inicio, titulo, detalle, fin, flecha, onClick }) {
  const interior = (
    <>
      {inicio ? <span className={css.inicio}>{inicio}</span> : null}
      <span className={css.textos}>
        <span className={css.titulo}>{titulo}</span>
        {detalle ? <span className={css.detalle}>{detalle}</span> : null}
      </span>
      {fin ? <span className={css.fin}>{fin}</span> : null}
      {flecha ? <Icono nombre="chevron_right" className={css.flecha} /> : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={`${css.fila} ${css.tocable}`}>
        {interior}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={`${css.fila} ${css.tocable}`} onClick={onClick}>
        {interior}
      </button>
    );
  }
  return <div className={css.fila}>{interior}</div>;
}
