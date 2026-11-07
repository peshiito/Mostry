import { REGISTRO } from '../../pagina/bloques/registro.js';
import { useBloqueBajo } from '../hooks/useBloqueBajo.js';
import { cajaDe } from '../lib/marcas.js';
import css from './CapaElegir.module.css';

function Marca({ pantalla, id, tipo }) {
  const c = id ? cajaDe(pantalla, id) : null;
  if (!c) return null;
  const { top, left, width, height } = c;
  return (
    <div className={css.marca} data-tipo={tipo} style={{ top, left, width, height }}>
      <span className={css.nombre}>{REGISTRO[c.tipo]?.nombre}</span>
    </div>
  );
}

// Encima de la vista previa (`pantalla` es el nodo que se desplaza): marca el bloque que está bajo el puntero y el
// elegido. Tocar un bloque lo elige (con teclado se elige desde la lista).
export function CapaElegir({ pantalla, elegido, onElegir }) {
  const { bajo } = useBloqueBajo(pantalla, elegido, onElegir);
  return (
    <div className={css.capa} aria-hidden="true">
      {bajo && bajo !== elegido ? (
        <Marca pantalla={pantalla} id={bajo} tipo="bajo" />
      ) : null}
      <Marca pantalla={pantalla} id={elegido} tipo="elegido" />
    </div>
  );
}
