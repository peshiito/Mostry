import { Link } from 'react-router';
import { FotoProducto } from '../../../shared/ui/FotoProducto.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { BotonAgregar } from '../../tienda/components/BotonAgregar.jsx';
import css from './BloqueDestacado.module.css';

// Un producto en grande: la foto de un lado y, del otro, nombre, precio, texto y
// el botón (Agregar o Consultar, según la tienda). En el celu va apilado.
export function BloqueDestacado({ bloque, datos, c }) {
  const p = c.productos.find((x) => x.id === datos.productoId);
  if (!p) return null;
  return (
    <section
      className={css.destacado}
      data-lado={datos.lado}
      data-v="destacado"
      aria-labelledby={`t-${bloque.id}`}
    >
      <Link
        to={`/producto/${p.id}`}
        className={css.marco}
        tabIndex={-1}
        aria-hidden="true"
      >
        <FotoProducto
          src={p.fotoGrande}
          nombre={p.nombre}
          className={css.foto}
          loading="lazy"
        />
      </Link>
      <div className={css.textos}>
        <span className={css.sello} data-v="destacado-sello">
          Destacado
        </span>
        <h2 id={`t-${bloque.id}`} className={css.titulo} data-v="titulo">
          {datos.titulo ?? p.nombre}
        </h2>
        <span className={css.precio} data-v="precio">
          <Monto centavos={p.precio} tamano="lg" />
        </span>
        {(datos.texto ?? p.descripcion) ? (
          <p className={css.texto}>{datos.texto ?? p.descripcion}</p>
        ) : null}
        <div className={css.acciones}>
          <BotonAgregar producto={p} conTexto />
          <Link to={`/producto/${p.id}`} className={css.ver} data-v="ver">
            Ver detalle
          </Link>
        </div>
      </div>
    </section>
  );
}
