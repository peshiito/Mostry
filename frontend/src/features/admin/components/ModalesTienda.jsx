import { HojaCortesia } from './HojaCortesia.jsx';
import { ModalPago } from './ModalPago.jsx';
import { ModalSuspender } from './ModalSuspender.jsx';

// Las hojas del detalle de una tienda: pago, cortesía y suspensión.
export function ModalesTienda({ modal, onCerrar, tienda: t, acciones: a }) {
  const hecho = async (r) => (await r).ok && onCerrar();
  return (
    <>
      <ModalPago
        abierta={modal === 'pago'}
        tienda={t}
        onCerrar={onCerrar}
        onRegistrar={(d) => hecho(a.registrarPago(d))}
      />
      <HojaCortesia
        abierta={modal === 'cortesia'}
        tienda={t}
        onCerrar={onCerrar}
        onRegalar={(d) => hecho(a.regalarDias(d))}
      />
      <ModalSuspender
        abierta={modal === 'suspender'}
        tienda={t}
        onCerrar={onCerrar}
        onConfirmar={(motivo) =>
          hecho(t.estado === 'suspendida' ? a.reactivar() : a.suspender(motivo))
        }
      />
    </>
  );
}
