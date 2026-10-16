import { plata } from '../../../shared/lib/plata.js';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { MEDIOS } from '../../gastos/lib/opciones.js';
import css from './NuevoEncargo.module.css';

// Si ya te pagó la seña, entra a la caja; el resto se cobra al entregar.
export function SenaCobrada({ form, total, onCambio }) {
  return (
    <Tarjeta className={css.bloque}>
      <p className={css.total}>
        <span>Total</span>
        <span>{plata(total)}</span>
      </p>
      <Interruptor
        etiqueta="Ya me pagó la seña"
        ayuda="Entra a la caja de hoy (en efectivo, con la caja abierta)"
        activo={form.conSena}
        onCambio={(conSena) => onCambio({ ...form, conSena })}
      />
      {form.conSena ? (
        <>
          <Campo etiqueta="¿Cuánto te pagó?">
            {(c) => (
              <Entrada
                c={c}
                prefijo="$"
                inputMode="decimal"
                value={form.sena}
                onChange={(e) => onCambio({ ...form, sena: e.target.value })}
              />
            )}
          </Campo>
          <Segmentado
            etiqueta="¿Cómo te pagó?"
            opciones={MEDIOS}
            valor={form.medio}
            onCambio={(medio) => onCambio({ ...form, medio })}
          />
        </>
      ) : null}
    </Tarjeta>
  );
}
