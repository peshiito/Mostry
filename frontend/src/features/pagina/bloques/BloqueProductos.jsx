import { ProductosVitrina } from '../../tienda/vitrina/ProductosVitrina.jsx';
import { SeccionVitrina } from '../../tienda/vitrina/SeccionVitrina.jsx';
import { productosDe, textosDe } from '../lib/productosDe.js';

// Carrusel o grilla de productos: destacados, todos, una categoría o elegidos.
export function BloqueProductos({ bloque, datos, c }) {
  const lista = productosDe(c, datos.fuente, datos.cantidad);
  if (!c.cargando && !lista.length) return null;
  const [titulo, bajada] = textosDe(datos.fuente, c, lista.length);
  const carrusel = datos.vista === 'carrusel';
  return (
    <SeccionVitrina
      id={`t-${bloque.id}`}
      titulo={datos.titulo ?? titulo}
      bajada={datos.bajada ?? bajada}
      ver={carrusel ? '/catalogo' : undefined}
    >
      <ProductosVitrina
        productos={lista}
        carrusel={carrusel}
        automatico={datos.automatico}
      />
    </SeccionVitrina>
  );
}
