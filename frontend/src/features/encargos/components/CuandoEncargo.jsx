import { Campo } from '../../../shared/ui/Campo.jsx';
import { SelectorFecha } from '../../../shared/ui/SelectorFecha.jsx';
import { SelectorHora } from '../../../shared/ui/SelectorHora.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './NuevoEncargo.module.css';

const hoy = () => new Date(new Date().toDateString());
// Lo mismo que acepta la API: de hoy a 60 días.
const elegible = (f) => f >= hoy() && f <= new Date(hoy().getTime() + 60 * 864e5);

// Día y hora. Vos mandás: no se aplican la anticipación ni el horario de la tienda.
export function CuandoEncargo({ form, onCambio }) {
  return (
    <Tarjeta className={css.bloque}>
      <Campo etiqueta="Día del encargo">
        {(c) => (
          <SelectorFecha
            c={c}
            etiqueta="Día del encargo"
            valor={form.fecha}
            disponible={elegible}
            onCambio={(fecha) => onCambio({ ...form, fecha })}
          />
        )}
      </Campo>
      <SelectorHora
        etiqueta="Hora"
        valor={form.hora}
        onCambio={(hora) => onCambio({ ...form, hora })}
      />
    </Tarjeta>
  );
}
