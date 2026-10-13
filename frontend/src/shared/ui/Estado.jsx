import { CheckDibujado } from '../movimiento/CheckDibujado.jsx';
import { Icono } from './Icono.jsx';
import css from './Estado.module.css';

// Estado vacío o de error: qué pasa y una sola acción para seguir.
// nivel 1 cuando el estado ES la pantalla (404, pedido inexistente): su h1.
// `logro`: algo salió bien (reporte enviado): un ✓ que se dibuja.
export function Estado({ icono, titulo, children, accion, error, logro, nivel = 2 }) {
  const Titulo = `h${nivel}`;
  return (
    <div className={css.estado} role={error ? 'alert' : undefined}>
      <span className={`${css.circulo} ${error ? css.error : ''}`}>
        {logro ? (
          <CheckDibujado tamano={36} />
        ) : (
          <Icono nombre={icono ?? (error ? 'error' : 'inbox')} tamano={32} />
        )}
      </span>
      <Titulo className={css.titulo}>{titulo}</Titulo>
      {children ? <p className={css.texto}>{children}</p> : null}
      {accion}
    </div>
  );
}
