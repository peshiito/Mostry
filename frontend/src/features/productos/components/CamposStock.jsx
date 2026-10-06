import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './CamposProducto.module.css';

// Stock disponible y umbral para el aviso de stock bajo.
export function CamposStock({ form, errores, onCambio }) {
  const set = (k) => (e) => onCambio({ ...form, [k]: e.target.value });
  return (
    <div className={css.dos}>
      <Campo etiqueta="Stock" error={errores.stock}>
        {(c) => (
          <Entrada
            c={c}
            type="number"
            min="0"
            inputMode="numeric"
            value={form.stock}
            onChange={set('stock')}
          />
        )}
      </Campo>
      <Campo etiqueta="Avisarme con menos de">
        {(c) => (
          <Entrada
            c={c}
            type="number"
            min="0"
            inputMode="numeric"
            value={form.stockMinimo}
            onChange={set('stockMinimo')}
          />
        )}
      </Campo>
    </div>
  );
}
