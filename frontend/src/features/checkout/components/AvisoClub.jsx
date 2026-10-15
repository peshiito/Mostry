import { Aviso } from '../../../shared/ui/Aviso.jsx';

// El comprador entró al Club Mostry y la tienda tiene club: este pedido es suyo
// y suma un sello cuando se lo entregan (si llega al mínimo).
export function AvisoClub({ cliente, club }) {
  if (!cliente || !club) return null;
  return (
    <Aviso icono="loyalty" titulo={`Comprás como ${cliente.nombre}, del Club`}>
      Este pedido suma un sello en el {club.nombre} cuando te lo entreguen.
    </Aviso>
  );
}
