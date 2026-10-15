import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';

// Lo que dice la fila sobre el stock, según cómo lo maneja el producto.
export function StockFila({ p }) {
  if (p.modoStock === 'a_pedido') return <Etiqueta tono="mostaza">A pedido</Etiqueta>;
  if (p.modoStock === 'simple') return null; // lo muestra el botón "Hay / No hay"
  const bajo = p.stock > 0 && p.stock <= p.stockMinimo;
  return (
    <>
      {`Stock: ${p.stock}`}
      {bajo ? <Etiqueta tono="mostaza">Stock bajo</Etiqueta> : null}
      {p.stock === 0 ? <Etiqueta tono="ladrillo">Agotado</Etiqueta> : null}
    </>
  );
}
