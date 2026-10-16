import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';

// Encargos 3: horas de anticipación de este producto (una torta, 48 h). Vale la
// mayor entre esta y la de la tienda; vacío usa la de la tienda. Sin usePanel:
// el formulario también se usa en el modo soporte del admin.
export function OpcionAnticipacion({ form, onCambio }) {
  if (form.modoStock !== 'a_pedido' && !form.aceptaEncargo) return null;
  return (
    <Campo
      etiqueta="Anticipación para encargarlo"
      ayuda="Vacío: la de tu tienda (Mi tienda → Cobros y envíos)"
    >
      {(c) => (
        <Entrada
          c={c}
          type="number"
          min="0"
          max="720"
          inputMode="numeric"
          sufijo="h"
          placeholder="La de la tienda"
          value={form.anticipacionHoras}
          onChange={(e) => onCambio({ ...form, anticipacionHoras: e.target.value })}
        />
      )}
    </Campo>
  );
}
