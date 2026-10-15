import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './HojaPremio.module.css';

// Cuánto vale el premio: porcentaje (con tope opcional) o monto en pesos.
export function CamposValor({ f, set }) {
  if (f.tipo === 'regalo') return null;
  const valor = (
    <Campo etiqueta={f.tipo === 'monto' ? 'Descuento' : 'Porcentaje'}>
      {(c) => (
        <Entrada
          c={c}
          inputMode={f.tipo === 'monto' ? 'decimal' : 'numeric'}
          prefijo={f.tipo === 'monto' ? '$' : undefined}
          sufijo={f.tipo === 'porcentaje' ? '%' : undefined}
          value={f.valor}
          onChange={(e) => set('valor', e.target.value)}
        />
      )}
    </Campo>
  );
  if (f.tipo === 'monto') return valor;
  return (
    <div className={css.doble}>
      {valor}
      <Campo etiqueta="Tope (opcional)">
        {(c) => (
          <Entrada
            c={c}
            inputMode="decimal"
            prefijo="$"
            value={f.tope}
            onChange={(e) => set('tope', e.target.value)}
          />
        )}
      </Campo>
    </div>
  );
}
