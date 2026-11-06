import { Link } from 'react-router';
import { FotoProducto } from '../../../shared/ui/FotoProducto.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { BotonAgregar } from '../components/BotonAgregar.jsx';
import css from './TarjetaVitrina.module.css';

const etiqueta = (p, agotado) =>
  agotado
    ? 'Agotado'
    : p.aceptaEncargo
      ? 'Por encargo'
      : p.destacado
        ? 'Más pedido'
        : null;

// Tarjeta de producto como la de una tienda online grande: foto sobre un fondo
// suave, etiqueta, nombre, categoría, precio y el botón para sumar.
export function TarjetaVitrina({ producto, ancha }) {
  const agotado = producto.agotado && !producto.aceptaEncargo;
  const sello = etiqueta(producto, agotado);
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
          {sello ? (
            <span className={css.sticker} data-v="sticker">
              {sello}
            </span>
          ) : null}
        </span>
        <span className={css.textos}>
          <span className={css.nombre} data-v="nombre-producto">
            {producto.nombre}
          </span>
          {producto.categoriaNombre ? (
            <span className={css.categoria} data-v="categoria-producto">
              {producto.categoriaNombre}
            </span>
          ) : null}
        </span>
      </Link>
      <div className={css.pie} data-v="pie-tarjeta">
        <span className={css.precio} data-v="precio">
          <Monto centavos={producto.precio} tamano="md" />
        </span>
        <BotonAgregar producto={producto} />
      </div>
    </article>
  );
}
