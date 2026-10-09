import { PANEL } from '../recorrido.js';
import css from './PanelBolsillo.module.css';

// El panel del comerciante: un recorte de cada pantalla, como una vidriera de funciones.
export function PanelBolsillo() {
  return (
    <ul className={css.grilla}>
      {PANEL.map(([img, titulo, texto]) => (
        <li key={img} className={css.item}>
          <div className={css.recorte}>
            <img
              src={`/landing/panel/${img}.webp`}
              alt={`${titulo} en el panel de Mostry`}
              width="600"
              height="1298"
              loading="lazy"
              decoding="async"
            />
          </div>
          <h3 className={css.titulo}>{titulo}</h3>
          <p className={css.detalle}>{texto}</p>
        </li>
      ))}
    </ul>
  );
}
