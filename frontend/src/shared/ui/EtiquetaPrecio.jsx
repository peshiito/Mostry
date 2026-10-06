import { Monto } from './Monto.jsx';
import css from './EtiquetaPrecio.module.css';

// "Etiqueta de góndola": rectángulo mostaza con esquina recortada.
export function EtiquetaPrecio({ centavos, antes, leyenda }) {
  return (
    <div className={css.etiqueta}>
      {antes ? <Monto centavos={antes} tamano="sm" tachado /> : null}
      <Monto centavos={centavos} tamano="lg" />
      {leyenda ? <span className={css.leyenda}>{leyenda}</span> : null}
    </div>
  );
}
