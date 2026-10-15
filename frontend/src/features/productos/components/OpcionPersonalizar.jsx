import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import { Interruptor } from '../../../shared/ui/Interruptor.jsx';

// Encargos 2: el comprador dice cómo lo quiere (texto y foto de referencia).
// Solo para lo que se encarga: una torta de cumple, no media docena de facturas.
export function OpcionPersonalizar({ form, onCambio }) {
  const set = (k) => (v) => onCambio({ ...form, [k]: v });
  if (form.modoStock !== 'a_pedido' && !form.aceptaEncargo) return null;
  return (
    <>
      <Interruptor
        etiqueta="Pide personalización"
        ayuda="El cliente escribe cómo lo quiere y puede sumar una foto de referencia"
        activo={form.pidePersonalizacion}
        onCambio={set('pidePersonalizacion')}
      />
      {form.pidePersonalizacion ? (
        <Campo
          etiqueta="Qué le pedís al cliente"
          ayuda="Por ejemplo: el texto, el sabor y el relleno"
        >
          {(c) => (
            <Entrada
              c={c}
              maxLength={200}
              value={form.indicacionPersonalizacion}
              onChange={(e) => set('indicacionPersonalizacion')(e.target.value)}
            />
          )}
        </Campo>
      ) : null}
    </>
  );
}
