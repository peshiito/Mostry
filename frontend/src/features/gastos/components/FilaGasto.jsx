import { fechaCorta } from '../../../shared/lib/fechas.js';
import { plata } from '../../../shared/lib/plata.js';
import { Etiqueta } from '../../../shared/ui/Etiqueta.jsx';
import { Fila } from '../../../shared/ui/Fila.jsx';

// Un gasto: detalle, fecha, proveedor, medio y monto.
export function FilaGasto({ gasto: g }) {
  const medio = g.medio === 'efectivo' ? 'Efectivo' : 'Transferencia';
  return (
    <Fila
      titulo={g.detalle ?? (g.tipo === 'inversion' ? 'Inversión' : 'Gasto')}
      detalle={`${fechaCorta(g.fecha)} · ${g.proveedor ?? 'Sin proveedor'} · ${medio}`}
      fin={
        <>
          <strong>{plata(g.monto)}</strong>
          {g.tipo === 'inversion' ? <Etiqueta tono="verde">Inversión</Etiqueta> : null}
        </>
      }
    />
  );
}
