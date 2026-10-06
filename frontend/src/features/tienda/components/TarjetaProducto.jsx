import { Link } from 'react-router';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { BotonAgregar } from './BotonAgregar.jsx';
import css from './TarjetaProducto.module.css';

// Tarjeta vertical (carrusel de destacados).
export function TarjetaProducto({ producto }) {
  return (
    <article className={css.tarjeta}>
      <Link to={`/producto/${producto.id}`} className={css.link}>
        <img src={producto.foto} alt="" className={css.foto} loading="lazy" />
        <h3 className={css.nombre}>{producto.nombre}</h3>
        <p className={css.desc}>{producto.descripcion}</p>
      </Link>
      {producto.aceptaEncargo ? (
        <span className={css.sello}>
          <Etiqueta tono="mostaza" mayus>
            Por encargo
          </Etiqueta>
        </span>
      ) : null}
      <div className={css.pie}>
        <Monto centavos={producto.precio} tamano="sm" />
        <BotonAgregar producto={producto} />
      </div>
    </article>
  );
}
