import { CheckDibujado } from '../movimiento/CheckDibujado.jsx';
import { Icono } from './Icono.jsx';
import css from './BotonExtras.module.css';

// Ícono, texto e ícono final del botón. Mientras guarda, el texto dice qué está
// pasando ("Guardando…") y una franja avanza abajo: nada de ruedita girando.
// `textoHecho`: al terminar bien, un ✓ dibujado y ese texto por un momento.
export function ContenidoBoton({
  icono,
  iconoFin,
  cargando,
  textoCargando,
  textoHecho,
  children,
}) {
  if (textoHecho && !cargando) {
    return (
      <>
        <CheckDibujado tamano={20} />
        <span>{textoHecho}</span>
      </>
    );
  }
  return (
    <>
      {!cargando && icono ? <Icono nombre={icono} tamano={20} /> : null}
      <span>{cargando && textoCargando ? textoCargando : children}</span>
      {!cargando && iconoFin ? <Icono nombre={iconoFin} tamano={20} /> : null}
      {cargando ? <span className={css.franja} aria-hidden="true" /> : null}
    </>
  );
}
