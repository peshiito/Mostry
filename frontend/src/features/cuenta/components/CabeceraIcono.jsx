import { Icono } from '../../../shared/ui/Icono.jsx';
import css from '../pantallas/Cuenta.module.css';

// Ícono en círculo + título + texto, centrado (pantallas de códigos).
export function CabeceraIcono({ icono, titulo, children }) {
  return (
    <div className={css.centro}>
      <span className={css.icono}>
        <Icono nombre={icono} tamano={28} />
      </span>
      <h1>{titulo}</h1>
      {children ? <p>{children}</p> : null}
    </div>
  );
}
