import { urlTienda } from '../../../shared/lib/urls.js';
import { ZONA_ACTUAL } from '../../../shared/lib/zonaActual.js';
import { CopiarDato } from '../../../shared/ui/CopiarDato.jsx';
import { Estado } from '../../../shared/ui/Estado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';

// Todavía no vendió hoy: si vende online, el link para compartir; si no, cómo
// anotar las ventas del local.
export function SinVentasHoy() {
  const { tienda } = usePanel();
  const online = tienda.vendeOnline !== false;
  return (
    <Tarjeta>
      <Estado icono="storefront" titulo="Todavía no vendiste hoy">
        {online
          ? 'Compartí el link de tu tienda para recibir pedidos.'
          : 'Anotá cada venta del local en Vender y la caja se arma sola.'}
      </Estado>
      {online ? (
        <CopiarDato
          etiqueta="Tu tienda"
          valor={urlTienda(ZONA_ACTUAL.slug).replace(/^https?:\/\//, '')}
        />
      ) : null}
    </Tarjeta>
  );
}
