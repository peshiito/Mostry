import { Hoja } from '../../../shared/ui/Hoja.jsx';
import { DetalleReporte } from './DetalleReporte.jsx';

// Detalle de un reporte en una hoja: qué pasó, la captura y la respuesta.
export function HojaReporte({ id, onCerrar, onCambio }) {
  return (
    <Hoja abierta={Boolean(id)} onCerrar={onCerrar} titulo="Reporte" ancha>
      {id ? <DetalleReporte key={id} id={id} onCambio={onCambio} /> : null}
    </Hoja>
  );
}
