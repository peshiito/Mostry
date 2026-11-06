import { Link } from 'react-router';
import { FotoProducto } from '../../../shared/ui/FotoProducto.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { BotonAgregar } from '../components/BotonAgregar.jsx';
import css from './TarjetaVitrina.module.css';

// Tarjeta de producto de la vidriera: foto grande, precio en su "etiqueta"
// (cada estilo la dibuja a su manera) y el botón para sumar.
export function TarjetaVitrina({ producto, ancha }) {
  const agotado = producto.agotado && !producto.aceptaEncargo;
  return (
    <article
      className={`${css.tarjeta} ${ancha ? css.ancha : ''} ${agotado ? css.agotado : ''}`}
      data-v="tarjeta"
    >
      <Link to={`/producto/${producto.id}`} className={css.link}>
        <span className={css.marco} data-v="foto">
          <FotoProducto
            src={producto.foto}
            nombre={producto.nombre}
            className={css.foto}
            loading="lazy"
            decoding="async"
          />
          {producto.aceptaEncargo || agotado ? (
            <span className={css.sticker} data-v="sticker">
              {agotado ? 'Agotado' : 'Por encargo'}
            </span>
          ) : null}
        </span>
        <span className={css.nombre} data-v="nombre-producto">
          {producto.nombre}
        </span>
      </Link>
      <div className={css.pie}>
        <span className={css.precio} data-v="precio">
          <Monto centavos={producto.precio} tamano="md" />
        </span>
        <BotonAgregar producto={producto} />
      </div>
    </article>
  );
}
