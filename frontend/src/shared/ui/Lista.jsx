import { Children } from 'react';
import { ItemAnimado, ListaAnimada } from '../movimiento/ListaAnimada.jsx';
import css from './Lista.module.css';

// Contenedor de filas con borde y esquinas redondeadas. Cada fila entra
// escalonada y, si se agrega o se va una, las demás se acomodan.
export function Lista({ children }) {
  return (
    <ListaAnimada as="div" className={css.lista} reacomodar>
      {Children.toArray(children).map((fila, i) => (
        <ItemAnimado as="div" key={fila.key} i={i} className={css.item}>
          {fila}
        </ItemAnimado>
      ))}
    </ListaAnimada>
  );
}
