import { urlPrivacidad } from '../../../shared/lib/legal.js';
import { Campo, Entrada } from '../../../shared/ui/Campo.jsx';
import css from './Bloque.module.css';

// "Tus datos": nombre y WhatsApp para coordinar, y para qué se usan (S2).
export function DatosComprador({ tienda, datos, errores, onCambio }) {
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
      <p className={css.nota}>
        Tus datos los ve solo {tienda}, para coordinar tu pedido.{' '}
        <a href={urlPrivacidad()}>Privacidad</a>
      </p>
    </fieldset>
  );
}
