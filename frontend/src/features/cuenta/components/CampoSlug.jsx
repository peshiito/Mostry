import { DOMINIO_BASE } from '../../../shared/lib/zonaActual.js';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './CampoSlug.module.css';

// "Tu link": input + sufijo fijo. Si ya está en uso, lo avisa la API al registrar.
export function CampoSlug({ valor, onCambio, error }) {
  const ok = valor && !error;
  return (
    <Campo
      etiqueta="Tu link en Mostry"
      error={error}
      extra={ok ? <span className={css.ok}>✓ Formato válido</span> : null}
    >
      {(c) => (
        <Entrada
          c={c}
          sufijo={`.${DOMINIO_BASE}`}
          autoCapitalize="none"
          spellCheck={false}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
        />
      )}
    </Campo>
  );
}
