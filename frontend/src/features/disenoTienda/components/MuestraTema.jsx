import { derivarTokens } from '../../../shared/temaTienda/derivar.js';
import css from './MuestraTema.module.css';

// Mini vidriera con los tokens del tema: así se ve el diseño antes de guardarlo.
export function MuestraTema({ tema, nombre = 'Tu tienda', modo = 'claro', chica }) {
  const { 'color-scheme': colorScheme, ...tokens } = derivarTokens(tema, modo);
  const estilo = { ...tokens, colorScheme };
  return (
    <div
      className={`${css.muestra} ${chica ? css.chica : ''}`}
      style={estilo}
      aria-hidden="true"
    >
      <div className={css.cabeza}>
        <span className={css.logo}>{nombre.slice(0, 1)}</span>
        <span className={css.nombre}>{nombre}</span>
      </div>
      <div className={css.cuerpo}>
        <span className={css.etiqueta}>Promo</span>
        <span className={css.titulo}>Lo más pedido</span>
        <span className={css.tarjeta}>
          <span className={css.texto}>Producto · $ 4.200</span>
          <span className={css.boton}>Agregar</span>
        </span>
      </div>
    </div>
  );
}
