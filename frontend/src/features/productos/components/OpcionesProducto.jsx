import { Interruptor } from '../../../shared/ui/Interruptor.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import { OpcionAnticipacion } from './OpcionAnticipacion.jsx';
import { OpcionPersonalizar } from './OpcionPersonalizar.jsx';

// Switches del producto: encargo, personalización, destacado y visible.
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
      <OpcionPersonalizar form={form} onCambio={onCambio} />
      <OpcionAnticipacion form={form} onCambio={onCambio} />
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
