import { EsqueletoFilas } from '../../../shared/ui/esqueletos/index.js';
import { Estado } from '../../../shared/ui/Estado.jsx';
import css from '../pantallas/PantallaProductos.module.css';
import { FilaProductoPanel } from './FilaProductoPanel.jsx';
import { ListaAnimada } from '../../../shared/movimiento/ListaAnimada.jsx';

// Lista del panel de productos. Distingue "todavía no cargaste nada" de
// "la búsqueda o la categoría no encontró nada".
export function ListaProductosPanel({ cargando, visibles, hayProductos, onAlternar }) {
  if (cargando) return <EsqueletoFilas foto filas={5} />;
  if (!visibles.length) {
    return hayProductos ? (
      <Estado icono="search" titulo="No hay productos con ese filtro">
        Probá con otra búsqueda o elegí "Todos".
      </Estado>
    ) : (
      <Estado icono="inventory_2" titulo="Cargá tu primer producto">
        Con foto, precio y stock. Aparece en tu tienda al instante.
      </Estado>
    );
  }
  return (
    <ListaAnimada className={css.lista}>
      {visibles.map((p, i) => (
        <FilaProductoPanel
          key={p.id}
          i={i}
          producto={p}
          onActivo={() => onAlternar(p.id, 'activo')}
          onAgotado={() => onAlternar(p.id, 'agotado')}
        />
      ))}
    </ListaAnimada>
  );
}
