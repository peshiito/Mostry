import { DOMINIO_BASE, ZONA_ACTUAL } from '../../../shared/lib/zonaActual.js';
import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';

// Sin pedidos todavía: invitar a compartir el link (Stitch 52).
export function PedidosVacio() {
  return (
    <Tarjeta>
      <Estado icono="receipt_long" titulo="Todavía no tenés pedidos">
        Compartí tu link para recibir el primero.
      </Estado>
      <CopiarDato etiqueta="Tu tienda" valor={`${ZONA_ACTUAL.slug}.${DOMINIO_BASE}`} />
    </Tarjeta>
  );
}
