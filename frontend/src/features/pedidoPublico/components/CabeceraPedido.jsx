import { ESTADOS } from '../../../shared/lib/estadosPedido.js';
import { fechaHora } from '../../../shared/lib/fechas.js';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { TituloPagina } from '../../../shared/ui/TituloPagina.jsx';

// "Pedido #128" + estado + fecha (o fecha del encargo).
export function CabeceraPedido({ pedido }) {
  const est = ESTADOS[pedido.estado];
  const bajada = pedido.fechaEncargo
    ? `Encargo para el ${fechaHora(pedido.fechaEncargo)}`
    : `Hecho el ${fechaHora(pedido.creadoEn)}`;
  return (
    <TituloPagina
      titulo={`Pedido #${pedido.numero}`}
      bajada={bajada}
      etiqueta={<Etiqueta tono={est.tono}>{est.texto}</Etiqueta>}
    />
  );
}
