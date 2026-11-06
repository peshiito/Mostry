import { SeccionVitrina } from './SeccionVitrina.jsx';
import css from './SobreNosotros.module.css';

// "Sobre nosotros": la historia del comercio, con la primera foto del local.
export function SobreNosotros({ texto, titulo, foto }) {
  if (!texto) return null;
  return (
    <SeccionVitrina id="nosotros" titulo={titulo ?? 'Sobre nosotros'}>
      <div className={css.bloque} data-v="nosotros">
        {foto ? <img src={foto} alt="" className={css.foto} loading="lazy" /> : null}
        <p className={css.texto}>{texto}</p>
      </div>
    </SeccionVitrina>
  );
}
