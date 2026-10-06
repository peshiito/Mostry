import { Link } from 'react-router';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { BotonAgregar } from './BotonAgregar.jsx';
import css from './FilaProducto.module.css';

// Fila del catálogo: foto cuadrada, nombre, etiqueta, precio y acción.
export function FilaProducto({ producto }) {
  const agotado = producto.agotado && !producto.aceptaEncargo;
  return (
    <li className={`${css.fila} ${agotado ? css.agotado : ''}`}>
      <Link to={`/producto/${producto.id}`} className={css.link}>
        <img src={producto.foto} alt="" className={css.foto} loading="lazy" />
        <span className={css.textos}>
          <span className={css.nombre}>{producto.nombre}</span>
          {agotado ? (
            <Etiqueta tono="gris" mayus>
              Agotado
            </Etiqueta>
          ) : null}
          {producto.aceptaEncargo ? (
            <Etiqueta tono="mostaza" mayus>
              Por encargo
            </Etiqueta>
          ) : null}
          <span className={css.desc}>{producto.descripcion}</span>
          <Monto
            centavos={producto.precio}
            tamano="sm"
            tono={agotado ? undefined : 'verde'}
          />
        </span>
      </Link>
      <BotonAgregar producto={producto} conTexto />
    </li>
  );
}
