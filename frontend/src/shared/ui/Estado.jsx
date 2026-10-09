import { Icono } from './Icono.jsx';
import css from './Estado.module.css';

// Estado vacío o de error: qué pasa y una sola acción para seguir.
// nivel 1 cuando el estado ES la pantalla (404, pedido inexistente): su h1.
export function Estado({ icono = 'inbox', titulo, children, accion, error, nivel = 2 }) {
  const Titulo = `h${nivel}`;
  return (
    <div className={css.estado} role={error ? 'alert' : undefined}>
      <span className={`${css.circulo} ${error ? css.error : ''}`}>
        <Icono nombre={error ? 'wifi_off' : icono} tamano={32} />
      </span>
      <Titulo className={css.titulo}>{titulo}</Titulo>
      {children ? <p className={css.texto}>{children}</p> : null}
      {accion}
    </div>
  );
}
