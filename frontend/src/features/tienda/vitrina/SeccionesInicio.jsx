import { EstadoCatalogo } from '../components/EstadoCatalogo.jsx';
import { ordenSecciones } from '../lib/secciones.js';
import { Margen } from './AvisosVitrina.jsx';
import { CategoriasVitrina } from './CategoriasVitrina.jsx';
import { ProductosVitrina } from './ProductosVitrina.jsx';
import { PIEZAS_EXTRA } from './piezasExtra.jsx';
import { SeccionVitrina } from './SeccionVitrina.jsx';

// Cada sección del inicio, en el orden y con el título que eligió el comercio.
const PIEZAS = {
  ...PIEZAS_EXTRA,
  categorias: ({ c }) =>
    c.cargando || c.error ? (
      <Margen>
        <EstadoCatalogo cargando={c.cargando} error={c.error} onReintentar={c.recargar} />
      </Margen>
    ) : (
      <CategoriasVitrina categorias={c.categorias} productos={c.productos} />
    ),
  destacados: ({ c, titulo }) =>
    c.destacados.length ? (
      <SeccionVitrina
        id="destacados"
        titulo={titulo ?? 'Lo más pedido'}
        bajada="Los favoritos de la casa"
        ver="/catalogo"
      >
        <ProductosVitrina productos={c.destacados} carrusel />
      </SeccionVitrina>
    ) : null,
  catalogo: ({ c, titulo }) => (
    <SeccionVitrina
      id="productos"
      titulo={titulo ?? 'Todo lo que hay'}
      bajada={`${c.productos.length} productos`}
    >
      <ProductosVitrina productos={c.productos} />
    </SeccionVitrina>
  ),
};

export function SeccionesInicio({ tienda, c }) {
  return ordenSecciones(tienda.contenido?.secciones)
    .filter((s) => s.visible)
    .map((s) => {
      const Pieza = PIEZAS[s.id];
      return <Pieza key={s.id} tienda={tienda} c={c} titulo={s.titulo ?? undefined} />;
    });
}
