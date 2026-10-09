import { useState } from 'react';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { AvisoError } from '../../../shared/ui/AvisoError.jsx';
import { ErrorCarga } from '../../../shared/ui/ErrorCarga.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';
import { ListaProductosPanel } from '../components/ListaProductosPanel.jsx';
import { useProductosPanel } from '../hooks/useProductosPanel.js';
import css from './PantallaProductos.module.css';
import { useBasePanel } from '../../panelBase/BasePanel.jsx';

const opcionesCategorias = (categorias) => [
  { valor: 'todo', texto: 'Todos' },
  ...categorias.map((c) => ({ valor: String(c.id), texto: c.nombre })),
];

// Productos y stock (Stitch 30).
export function PantallaProductos() {
  const { rutas } = useBasePanel();
  const { productos, categorias, alternar, cargando, error, recargar, errorCambio } =
    useProductosPanel();
  const [cat, setCat] = useState('todo');
  const [q, setQ] = useState('');
  if (error) return <ErrorCarga que="tus productos" onReintentar={recargar} />;
  const visibles = productos.filter(
    (p) =>
      (cat === 'todo' || String(p.categoriaId) === cat) &&
      p.nombre.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Pagina espacio="sm">
      <TituloPagina
        titulo="Productos"
        accion={
          <Boton tamano="sm" icono="category" to={`${rutas}/categorias`}>
            Categorías
          </Boton>
        }
      />
      <AvisoError error={errorCambio} />
      <Buscador valor={q} onCambio={setQ} placeholder="Buscar producto" />
      <Chips
        etiqueta="Categoría"
        opciones={opcionesCategorias(categorias)}
        valor={cat}
        onCambio={setCat}
      />
      <ListaProductosPanel
        cargando={cargando}
        visibles={visibles}
        hayProductos={productos.length > 0}
        onAlternar={alternar}
      />
      <Boton
        variante="principal"
        tamano="lg"
        icono="add"
        className={css.flotante}
        to={`${rutas}/productos/nuevo`}
      >
        Producto
      </Boton>
    </Pagina>
  );
}
