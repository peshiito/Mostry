import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import { textoPremio } from '../lib/textoPremio.js';

// Una compra en palabras: dónde, cuándo, si sumó sello y qué premio usó.
// `delCliente`: lo lee el cliente ("usaste"); si no, el comercio ("usó").
export function detalleCompra(c, delCliente) {
  const partes = [
    c.origen === 'venta' ? 'En el local' : 'Online',
    fechaCorta(c.fecha),
    c.sello ? 'sumó un sello' : null,
    c.premio ? `${delCliente ? 'usaste' : 'usó'}: ${textoPremio(c.premio)}` : null,
  ];
  return partes.filter(Boolean).join(' · ');
}

// Las últimas compras del cliente del Club (en todas sus tiendas o en una).
export function ListaCompras({ compras, conTienda }) {
  if (!compras.length) return null;
  return (
    <Lista>
      {compras.map((c, i) => (
        <Fila
          key={`${c.origen}-${c.fecha}-${i}`}
          inicio={<Icono nombre={c.origen === 'venta' ? 'storefront' : 'shopping_bag'} />}
          titulo={conTienda ? c.tienda.nombre : plata(c.total)}
          detalle={detalleCompra(c, conTienda)}
          fin={conTienda ? plata(c.total) : null}
        />
      ))}
    </Lista>
  );
}
