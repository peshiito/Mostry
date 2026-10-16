import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Fila } from '../../../shared/ui/Fila.jsx';

// La fecha del pago es un día ('AAAA-MM-DD'): al mediodía para que no cambie de día.
const dia = (f) => fechaCorta(`${f}T15:00:00Z`);

// Un pago registrado, o los días de cortesía que regaló Mostry (S1).
export function FilaPago({ pago: p }) {
  if (p.tipo === 'cortesia')
    return (
      <Fila
        titulo={`🎁 Cortesía · +${p.dias} días`}
        detalle={`${p.motivo} · cubre hasta el ${fechaCorta(p.hasta)}`}
      />
    );
  return (
    <Fila
      titulo={plata(p.monto)}
      detalle={`Pagado el ${dia(p.fecha)} · cubre hasta el ${fechaCorta(p.hasta)}`}
    />
  );
}
