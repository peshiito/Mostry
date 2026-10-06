import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './FormAprobacion.module.css';

// Monto, fecha, titular y número de operación de la transferencia.
export function FormAprobacion({ datos, errores, onCambio }) {
  const set = (k) => (e) => onCambio({ ...datos, [k]: e.target.value });
  return (
    <fieldset className={css.form}>
      <legend className={css.titulo}>Datos de la transferencia</legend>
      <Campo etiqueta="Monto que te llegó" error={errores.monto}>
        {(c) => (
          <Entrada
            c={c}
            prefijo="$"
            inputMode="decimal"
            value={datos.monto}
            onChange={set('monto')}
          />
        )}
      </Campo>
      <Campo etiqueta="Fecha de la operación" error={errores.fecha}>
        {(c) => <Entrada c={c} type="date" value={datos.fecha} onChange={set('fecha')} />}
      </Campo>
      <Campo etiqueta="Titular que pagó" error={errores.titular}>
        {(c) => <Entrada c={c} value={datos.titular} onChange={set('titular')} />}
      </Campo>
      <Campo etiqueta="Número de operación" error={errores.operacion}>
        {(c) => <Entrada c={c} value={datos.operacion} onChange={set('operacion')} />}
      </Campo>
    </fieldset>
  );
}
