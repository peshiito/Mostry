import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Esqueleto } from '../../../shared/ui/Esqueleto.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { FilaProductoPanel } from '../components/FilaProductoPanel.jsx';
import { useProductosPanel } from '../hooks/useProductosPanel.js';
import css from './PantallaProductos.module.css';

// Productos y stock (Stitch 30).
export function PantallaProductos() {
  const { productos, categorias, alternar, cargando } = useProductosPanel();
  const [cat, setCat] = useState('todo');
  const [q, setQ] = useState('');
  const visibles = productos.filter(
    (p) =>
      (cat === 'todo' || String(p.categoriaId) === cat) &&
      p.nombre.toLowerCase().includes(q.toLowerCase()),
  );
  const opciones = [
    { valor: 'todo', texto: 'Todos' },
    ...categorias.map((c) => ({ valor: String(c.id), texto: c.nombre })),
  ];
  return (
    <Pagina espacio="sm">
      <TituloPagina
        titulo="Productos"
        accion={
          <Boton tamano="sm" icono="category" to="/panel/categorias">
            Categorías
          </Boton>
        }
      />
      <Buscador valor={q} onCambio={setQ} placeholder="Buscar producto" />
      <Chips etiqueta="Categoría" opciones={opciones} valor={cat} onCambio={setCat} />
      {cargando ? (
        <Esqueleto filas={5} />
      ) : visibles.length ? (
        <ul className={css.lista}>
          {visibles.map((p) => (
            <FilaProductoPanel
              key={p.id}
              producto={p}
              onActivo={() => alternar(p.id, 'activo')}
            />
          ))}
        </ul>
      ) : (
        <Estado icono="inventory_2" titulo="Cargá tu primer producto">
          Con foto, precio y stock. Aparece en tu tienda al instante.
        </Estado>
      )}
      <Boton
        variante="principal"
        tamano="lg"
        icono="add"
        className={css.flotante}
        to="/panel/productos/nuevo"
      >
        Producto
      </Boton>
    </Pagina>
  );
}
