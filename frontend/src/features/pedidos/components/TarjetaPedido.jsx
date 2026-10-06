import { Link } from 'react-router';
import { ESTADOS } from '../../../shared/lib/estadosPedido.js';
import { fechaHora, haceCuanto } from '../../../shared/lib/fechas.js';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Monto } from '../../../shared/ui/Monto.jsx';
import css from './TarjetaPedido.module.css';

// Pedido en la lista del panel: número, cliente, total, entrega y estado.
export function TarjetaPedido({ pedido: p }) {
  const est = ESTADOS[p.estado];
  return (
    <Link to={`/panel/pedidos/${p.id}`} className={css.tarjeta}>
      <div className={css.cabeza}>
        <span className={css.titulo}>
          #{p.numero} · {p.cliente}
        </span>
        <Monto centavos={p.total} tamano="sm" />
      </div>
      <div className={css.meta}>
        <Icono
          nombre={p.entrega === 'envio' ? 'local_shipping' : 'storefront'}
          tamano={18}
        />
        <span>{p.entrega === 'envio' ? 'Envío' : 'Retiro'}</span>
        <span aria-hidden="true">·</span>
        <span>{haceCuanto(p.creadoEn)}</span>
      </div>
      {p.resumen ? <p className={css.resumen}>{p.resumen}</p> : null}
      <div className={css.pie}>
        <Etiqueta tono={est.tono} punto>
          {est.texto}
        </Etiqueta>
        {p.tipo === 'encargo' ? (
          <Etiqueta tono="coral">Encargo · {fechaHora(p.fechaEncargo)}</Etiqueta>
        ) : null}
      </div>
    </Link>
  );
}
