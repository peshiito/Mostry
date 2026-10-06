import { ESTADOS } from '../../../shared/lib/estadosPedido.js';
import { hora } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { accionPrincipal } from '../../pedidos/lib/acciones.js';
import css from './TarjetaEncargo.module.css';

// Encargo del día: hora, detalle, cliente, seña y el próximo paso.
export function TarjetaEncargo({ encargo: e, principal, onCambiar }) {
  const est = ESTADOS[e.estado];
  const accion = accionPrincipal(e);
  // Entregar con resto o cancelar piden datos: se hacen desde el detalle del pedido.
  const alDetalle = accion?.siguiente === 'entregado' && e.total > e.sena;
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
      </p>
      <p className={css.plata}>
        {e.sena
          ? `Seña pagada ${plata(e.sena)} · Resta ${plata(e.total - e.sena)}`
          : `Total ${plata(e.total)} al retirar`}
      </p>
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
            {accion.texto}
          </Boton>
          {e.estado === 'pendiente_confirmacion' ? (
            <Boton to={`/panel/pedidos/${e.id}`}>Ver</Boton>
          ) : null}
        </div>
      ) : null}
    </Tarjeta>
  );
}
