import { SeccionTitulo } from '../../../shared/ui/SeccionTitulo.jsx';
import { Link } from 'react-router';
import { TarjetaProducto } from './TarjetaProducto.jsx';
import css from './Destacados.module.css';

// Carrusel horizontal de destacados.
export function Destacados({ productos }) {
  if (!productos.length) return null;
  return (
    <section aria-labelledby="destacados" className={css.seccion}>
      <SeccionTitulo
        id="destacados"
        titulo="Lo más pedido"
        bajada="Los favoritos de la casa"
        accion={<Link to="/catalogo">Ver todos</Link>}
      />
      <ul className={css.carrusel}>
        {productos.map((p) => (
          <li key={p.id}>
            <TarjetaProducto producto={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
