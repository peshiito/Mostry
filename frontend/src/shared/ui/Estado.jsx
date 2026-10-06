import { Icono } from './Icono.jsx';
import css from './Estado.module.css';

// Estado vacío o de error: qué pasa y una sola acción para seguir.
export function Estado({ icono = 'inbox', titulo, children, accion, error }) {
  return (
    <div className={css.estado} role={error ? 'alert' : undefined}>
      <span className={`${css.circulo} ${error ? css.error : ''}`}>
        <Icono nombre={error ? 'wifi_off' : icono} tamano={32} />
      </span>
      <h2 className={css.titulo}>{titulo}</h2>
      {children ? <p className={css.texto}>{children}</p> : null}
      {accion}
    </div>
  );
}
