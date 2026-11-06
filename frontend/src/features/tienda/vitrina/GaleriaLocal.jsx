import { SeccionVitrina } from './SeccionVitrina.jsx';
import css from './GaleriaLocal.module.css';

// Fotos del local en una grilla: la primera grande y las demás de a dos.
export function GaleriaLocal({ fotos, titulo }) {
  if (!fotos?.length) return null;
  return (
    <SeccionVitrina id="galeria" titulo={titulo ?? 'Nuestro local'}>
      <ul className={css.grilla} data-v="galeria">
        {fotos.map((f) => (
          <li key={f.id}>
            <img src={f.url} alt="" className={css.foto} loading="lazy" />
          </li>
        ))}
      </ul>
    </SeccionVitrina>
  );
}
