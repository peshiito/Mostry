import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './Bloque.module.css';

// "Tus datos": nombre y WhatsApp para coordinar.
export function DatosComprador({ datos, errores, onCambio }) {
  const set = (k) => (e) => onCambio({ ...datos, [k]: e.target.value });
  return (
    <fieldset className={css.bloque}>
      <legend className={css.titulo}>Tus datos</legend>
      <Campo etiqueta="Nombre y apellido" error={errores.nombre}>
        {(c) => (
          <Entrada
            c={c}
            autoComplete="name"
            value={datos.nombre}
            onChange={set('nombre')}
          />
        )}
      </Campo>
      <Campo
        etiqueta="WhatsApp"
        ayuda="Te escribimos acá para avisarte cómo va tu pedido."
        error={errores.whatsapp}
      >
        {(c) => (
          <Entrada
            c={c}
            prefijo="+54"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={datos.whatsapp}
            onChange={set('whatsapp')}
          />
        )}
      </Campo>
    </fieldset>
  );
}
