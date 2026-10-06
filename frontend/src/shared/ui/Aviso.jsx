import { Icono } from './Icono.jsx';
import css from './Aviso.module.css';

const ICONO = { info: 'info', alerta: 'schedule', error: 'error', ok: 'check_circle' };

// Aviso en línea. tipo: info · alerta (mostaza) · error (ladrillo) · ok
export function Aviso({ tipo = 'info', titulo, children, accion, icono }) {
  return (
    <div
      className={`${css.aviso} ${css[tipo]}`}
      role={tipo === 'error' ? 'alert' : 'status'}
    >
      <Icono nombre={icono ?? ICONO[tipo]} tamano={22} className={css.icono} />
      <div className={css.cuerpo}>
        {titulo ? <p className={css.titulo}>{titulo}</p> : null}
        {children ? <div className={css.texto}>{children}</div> : null}
      </div>
      {accion}
    </div>
  );
}
