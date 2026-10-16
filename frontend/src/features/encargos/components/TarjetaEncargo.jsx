import { ESTADOS } from '../../../shared/lib/estadosPedido.js';
import { hora } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { accionPrincipal, porAceptar } from '../../pedidos/lib/acciones.js';
import css from './TarjetaEncargo.module.css';

function textoPlata(e) {
  if (!e.sena) return `Total ${plata(e.total)} al retirar`;
  if (porAceptar(e))
    return `Seña de ${plata(e.sena)} al aceptarlo · Total ${plata(e.total)}`;
  return `Seña ${plata(e.sena)} · Resta ${plata(e.total - e.sena)}`;
}

// Encargo del día: hora, detalle, cliente, seña y el próximo paso.
export function TarjetaEncargo({ encargo: e, principal, onCambiar }) {
  const est = ESTADOS[e.estado];
  const accion = accionPrincipal(e);
  // Aceptar (hay que ver la personalización) y entregar con resto se hacen
  // desde el detalle del pedido.
  const aceptar = porAceptar(e);
  const alDetalle = aceptar || (accion?.siguiente === 'entregado' && e.total > e.sena);
  return (
    <Tarjeta
      className={`${css.tarjeta} ${e.estado === 'pendiente_confirmacion' ? css.pendiente : ''}`}
    >
      <div className={css.cabeza}>
        <span className={css.hora}>{hora(e.fecha)}</span>
        <Etiqueta tono={est.tono}>{est.texto}</Etiqueta>
      </div>
      <p className={css.detalle}>{e.detalle}</p>
      <p className={css.cliente}>
        {e.cliente} · Pedido #{e.numero}
        {e.origen === 'panel' ? ' · Cargado por vos' : ''}
      </p>
      <p className={css.plata}>{textoPlata(e)}</p>
      {accion ? (
        <div className={css.acciones}>
          <Boton
            variante={principal ? 'principal' : 'verde'}
            anchoCompleto
            to={alDetalle ? `/panel/pedidos/${e.id}` : accion.ruta}
            onClick={
              alDetalle || accion.ruta
                ? undefined
                : () => onCambiar(e.id, accion.siguiente)
            }
          >
            {aceptar ? 'Revisar y aceptar' : accion.texto}
          </Boton>
        </div>
      ) : null}
    </Tarjeta>
  );
}
