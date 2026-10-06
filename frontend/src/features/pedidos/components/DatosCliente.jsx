import { linkMapsSeguro } from '../../../shared/lib/linkSeguro.js';
import { Boton } from '../../../shared/ui/Boton.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './DatosCliente.module.css';

// Cliente y entrega del pedido, con WhatsApp y link de Maps.
export function DatosCliente({ pedido: p }) {
  const maps = linkMapsSeguro(p.linkMaps);
  return (
    <Tarjeta className={css.datos}>
      <div className={css.fila}>
        <div>
          <p className={css.etiqueta}>Cliente</p>
          <p className={css.nombre}>{p.cliente}</p>
        </div>
        <Boton tamano="sm" icono="chat" href={`https://wa.me/${p.clienteWhatsapp}`}>
          WhatsApp
        </Boton>
      </div>
      <div className={css.entrega}>
        <Icono nombre={p.entrega === 'envio' ? 'local_shipping' : 'storefront'} />
        <div>
          <p className={css.nombre}>
            {p.entrega === 'envio' ? 'Envío a domicilio' : 'Retira en el local'}
          </p>
          {p.entrega === 'envio' ? <p>{p.direccion}</p> : null}
          {maps ? (
            <a href={maps} target="_blank" rel="noopener noreferrer">
              Ver en Maps
            </a>
          ) : null}
        </div>
      </div>
    </Tarjeta>
  );
}
