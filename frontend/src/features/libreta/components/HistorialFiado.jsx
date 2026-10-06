import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import css from './HistorialFiado.module.css';

// Deudas en rojo (+) y pagos en verde (−), como en la libreta de papel.
export function HistorialFiado({ movimientos }) {
  return (
    <Lista>
      {movimientos.map((m) => {
        const deuda = m.tipo === 'deuda';
        return (
          <Fila
            key={m.id}
            inicio={
              <Icono
                nombre={deuda ? 'north_east' : 'south_west'}
                className={deuda ? css.deuda : css.pago}
              />
            }
            titulo={m.detalle}
            detalle={`${fechaCorta(m.fecha)} · ${deuda ? 'Fiado' : 'Pago'}`}
            fin={
              <strong
                className={deuda ? css.deuda : css.pago}
              >{`${deuda ? '+' : '−'}${plata(m.monto)}`}</strong>
            }
          />
        );
      })}
    </Lista>
  );
}
