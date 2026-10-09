import { PASOS } from '../recorrido.js';
import { Celular } from './Celular.jsx';
import css from './PasosPedido.module.css';

// Un pedido de punta a punta, con las pantallas reales de cada paso.
export function PasosPedido() {
  return (
    // Se desliza de costado en el celular: con tabIndex también se recorre con las flechas.
    <ol className={css.pasos} tabIndex={0} aria-label="Los cuatro pasos de un pedido">
      {PASOS.map(([img, titulo, texto], i) => (
        <li key={img} className={css.paso}>
          <Celular
            tamano="sm"
            imagenes={[
              { src: `/landing/pasos/${img}.webp`, alt: `${titulo}: pantalla de Mostry` },
            ]}
          />
          <div className={css.texto}>
            <span className={css.numero} aria-hidden="true">
              {i + 1}
            </span>
            <h3 className={css.titulo}>{titulo}</h3>
            <p className={css.detalle}>{texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
