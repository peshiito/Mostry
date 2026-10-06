import { Boton } from '../../../shared/ui/Boton.jsx';
import { accionPrincipal } from '../lib/acciones.js';
import css from './AccionesPedido.module.css';

// Botón coral con el próximo paso + avisar por WhatsApp (link armado por la API) + cancelar.
export function AccionesPedido({ pedido, onAvanzar, onCancelar, soloLectura, enviando }) {
  const accion = accionPrincipal(pedido);
  const cerrado = ['entregado', 'cancelado'].includes(pedido.estado);
  return (
    <div className={css.acciones}>
      {accion && !soloLectura ? (
        <Boton
          variante="principal"
          tamano="lg"
          anchoCompleto
          cargando={enviando}
          to={accion.ruta}
          onClick={accion.siguiente ? () => onAvanzar(accion.siguiente) : undefined}
        >
          {accion.texto}
        </Boton>
      ) : null}
      <Boton icono="chat" anchoCompleto href={pedido.whatsapp}>
        Avisar por WhatsApp
      </Boton>
      {!cerrado && !soloLectura ? (
        <Boton variante="texto" className={css.cancelar} onClick={onCancelar}>
          Cancelar pedido
        </Boton>
      ) : null}
    </div>
  );
}
