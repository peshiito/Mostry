import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Segmentado } from '../../../shared/ui/Segmentado.jsx';
import { Selector } from '../../../shared/ui/Selector.jsx';
import { MEDIOS, TIPOS } from '../lib/opciones.js';
import css from './FormGasto.module.css';

// Campos del gasto: tipo, monto, medio, proveedor opcional y detalle (la fecha es hoy).
export function FormGasto({ g, errores, proveedores, onCambio }) {
  const set = (k) => (e) => onCambio({ ...g, [k]: e.target.value });
  const provs = [
    { valor: '', texto: 'Sin proveedor' },
    ...proveedores.map((p) => ({ valor: String(p.id), texto: p.nombre })),
  ];
  return (
    <div className={css.form}>
      <Segmentado
        etiqueta="Tipo"
        opciones={TIPOS}
        valor={g.tipo}
        onCambio={(tipo) => onCambio({ ...g, tipo })}
      />
      <Campo etiqueta="Monto" error={errores.monto}>
        {(c) => (
          <Entrada
            c={c}
            prefijo="$"
            inputMode="decimal"
            value={g.monto}
            onChange={set('monto')}
          />
        )}
      </Campo>
      <Segmentado
        etiqueta="Medio de pago"
        opciones={MEDIOS}
        valor={g.medio}
        onCambio={(medio) => onCambio({ ...g, medio })}
      />
      <Campo etiqueta="Proveedor (opcional)">
        {(c) => (
          <Selector
            c={c}
            opciones={provs}
            value={g.proveedorId}
            onChange={set('proveedorId')}
          />
        )}
      </Campo>
      <Campo etiqueta="Detalle" error={errores.detalle}>
        {(c) => (
          <Entrada
            c={c}
            placeholder="Ej: Harina 25 kg"
            value={g.detalle}
            onChange={set('detalle')}
          />
        )}
      </Campo>
    </div>
  );
}
