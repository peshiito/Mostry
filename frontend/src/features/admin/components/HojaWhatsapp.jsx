import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { Mensaje } from './MensajeWhatsapp.jsx';

// Escribirle a una tienda por WhatsApp (wa.me, sin API ni costo).
export function HojaWhatsapp({ tienda, onCerrar }) {
  return (
    <Hoja
      abierta={Boolean(tienda)}
      onCerrar={onCerrar}
      titulo="Mandar WhatsApp"
      subtitulo={tienda?.nombre}
    >
      {tienda ? <Mensaje key={tienda.id} tienda={tienda} /> : null}
    </Hoja>
  );
}
