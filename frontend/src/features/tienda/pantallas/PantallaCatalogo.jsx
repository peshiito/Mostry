import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Buscador } from '../../../shared/ui/Buscador.jsx';
import { Chips } from '../../../shared/ui/Chips.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { BarraCarrito } from '../components/BarraCarrito.jsx';
import { EstadoCatalogo } from '../components/EstadoCatalogo.jsx';
import { PieTienda } from '../components/PieTienda.jsx';
import { useCatalogo } from '../hooks/useCatalogo.js';
import { BarraSitio } from '../sitio/BarraSitio.jsx';
import { ProductosVitrina } from '../vitrina/ProductosVitrina.jsx';
import css from './Listado.module.css';

const normal = (t) =>
  t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Catálogo como la página "Tienda" de una web: título, buscador, categorías y
// la grilla de productos (2 columnas en el celu, hasta 4 en la compu).
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
      <BarraSitio />
      <main id="contenido" tabIndex={-1} className={css.pagina}>
        <div className={css.cabeza}>
          <h1 className={css.titulo} data-v="titulo">
            Productos
          </h1>
          <p className={css.cuenta}>{visibles.length} productos</p>
        </div>
        <div className={css.filtros}>
          <Buscador valor={texto} onCambio={setTexto} />
          <Chips
            etiqueta="Categorías"
            opciones={opciones}
            valor={categoria}
            onCambio={(v) => setParams(v === 'todo' ? {} : { categoria: v })}
          />
        </div>
        <EstadoCatalogo cargando={cargando} error={error} onReintentar={recargar} />
        {cargando || error ? null : visibles.length ? (
          <ProductosVitrina key={categoria} productos={visibles} />
        ) : (
          <div className={css.vacio}>
            <Estado icono="search" titulo={`No encontramos "${texto}"`}>
              Probá con otra palabra o mirá otra categoría.
            </Estado>
          </div>
        )}
      </main>
      <PieTienda />
      <BarraCarrito />
    </>
  );
}
