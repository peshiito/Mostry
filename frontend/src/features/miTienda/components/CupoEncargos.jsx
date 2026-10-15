import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';

// Encargos 2: máximo de encargos por día (vacío = sin límite). Lleno el día,
// la vidriera lo muestra sin lugar y no deja encargar.
export function CupoEncargos({ t, onCambio }) {
  return (
    <Campo etiqueta="Máximo de encargos por día" ayuda="Dejalo vacío si no tenés límite">
      {(c) => (
        <Entrada
          c={c}
          type="number"
          min="1"
          inputMode="numeric"
          placeholder="Sin límite"
          value={t.cupoEncargosDia ?? ''}
          onChange={(e) => onCambio({ ...t, cupoEncargosDia: e.target.value })}
        />
      )}
    </Campo>
  );
}
