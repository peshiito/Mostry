import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Pagina } from '../../../shared/ui/Pagina.jsx';
import { BarraCarrito } from '../components/BarraCarrito.jsx';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { FilaProducto } from '../components/FilaProducto.jsx';
import { EstadoCatalogo } from '../components/EstadoCatalogo.jsx';
import { HeaderTienda } from '../components/HeaderTienda.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import css from './Listado.module.css';

const normal = (t) =>
  t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Catálogo con buscador y categorías (Stitch 13).
export function PantallaCatalogo() {
  const { productos, categorias, cargando, error, recargar } = useCatalogo();
  const [params, setParams] = useSearchParams();
  const [texto, setTexto] = useState('');
  const categoria = params.get('categoria') ?? 'todo';
  const opciones = [
    { valor: 'todo', texto: 'Todo' },
    ...categorias.map((c) => ({ valor: String(c.id), texto: c.nombre })),
  ];
  const visibles = productos.filter(
    (p) =>
      (categoria === 'todo' || String(p.categoriaId) === categoria) &&
      normal(p.nombre).includes(normal(texto)),
  );
  return (
    <>
      <HeaderTienda volver="/" titulo="Catálogo" />
      <Pagina espacio="sm">
        <h1 className="soloLector">Catálogo</h1>
        <Buscador valor={texto} onCambio={setTexto} />
        <Chips
          etiqueta="Categorías"
          opciones={opciones}
          valor={categoria}
          onCambio={(v) => setParams(v === 'todo' ? {} : { categoria: v })}
        />
        <EstadoCatalogo cargando={cargando} error={error} onReintentar={recargar} />
        {cargando || error ? null : visibles.length ? (
          <ul className={css.lista}>
            {visibles.map((p) => (
              <FilaProducto key={p.id} producto={p} />
            ))}
          </ul>
        ) : (
          <div className={css.vacio}>
            <Estado icono="search" titulo={`No encontramos "${texto}"`}>
              Probá con otra palabra o mirá otra categoría.
            </Estado>
          </div>
        )}
      </Pagina>
      <BarraCarrito />
    </>
  );
}
