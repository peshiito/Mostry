import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';

// Switches del producto: encargo, destacado y visible.
export function OpcionesProducto({ form, onCambio }) {
  const set = (k) => (v) => onCambio({ ...form, [k]: v });
  return (
    <Tarjeta>
      {/* Lo que se hace a pedido siempre se encarga: no hace falta preguntarlo. */}
      {form.modoStock === 'a_pedido' ? null : (
        <Interruptor
          etiqueta="También se puede encargar"
          ayuda="Con fecha y hora; el encargo no descuenta stock"
          activo={form.aceptaEncargo}
          onCambio={set('aceptaEncargo')}
        />
      )}
      <Interruptor
        etiqueta="Destacado en el inicio"
        activo={form.destacado}
        onCambio={set('destacado')}
      />
      <Interruptor
        etiqueta="Visible en la tienda"
        activo={form.activo}
        onCambio={set('activo')}
      />
    </Tarjeta>
  );
}
