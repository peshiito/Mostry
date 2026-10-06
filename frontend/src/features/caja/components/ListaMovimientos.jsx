import { plata } from '../../../shared/lib/plata.js';
import { Fila } from '../../../shared/ui/Fila.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { Lista } from '../../../shared/ui/Lista.jsx';
import css from './ListaMovimientos.module.css';

const SIGNO = { ingreso: '+', egreso: '−', deposito: '−' };

// Movimientos del día: hora, concepto, medio y monto con signo y color.
export function ListaMovimientos({ movimientos }) {
  return (
    <Lista>
      {movimientos.map((m) => (
        <Fila
          key={m.id}
          inicio={
            <span className={css.icono}>
              <Icono
                nombre={m.medio === 'efectivo' ? 'payments' : 'account_balance'}
                tamano={20}
              />
            </span>
          }
          titulo={m.concepto}
          detalle={`${m.hora} · ${m.medio === 'efectivo' ? 'Efectivo' : 'Transferencia'}`}
          fin={
            <span className={m.tipo === 'ingreso' ? css.ingreso : css.egreso}>
              {SIGNO[m.tipo]}
              {plata(m.monto)}
            </span>
          }
        />
      ))}
    </Lista>
  );
}
