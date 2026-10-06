import { Icono } from '../../../shared/ui/Icono.jsx';
import css from './TarjetasIcono.module.css';

// Grilla de tarjetas: [ícono, título, texto, pie?]. tono: problema | beneficio.
export function TarjetasIcono({ items, tono = 'beneficio' }) {
  return (
    <ul className={`${css.grilla} ${css[tono]}`}>
      {items.map(([icono, titulo, texto, pie]) => (
        <li key={titulo} className={css.tarjeta}>
          <span className={css.icono}>
            <Icono nombre={icono} />
          </span>
          <h3 className={css.titulo}>{titulo}</h3>
          <p className={css.texto}>{texto}</p>
          {pie ? <p className={css.pie}>{pie}</p> : null}
        </li>
      ))}
    </ul>
  );
}
