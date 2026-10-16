import { urlPrivacidad, urlTerminos } from '../../../shared/lib/legal.js';
import css from './LinksLegales.module.css';

// Términos y privacidad desde el panel o el Club (los documentos viven en el sitio).
export function LinksLegales() {
  return (
    <nav aria-label="Legales" className={css.links}>
      <a href={urlTerminos()}>Términos y condiciones</a>
      <a href={urlPrivacidad()}>Política de privacidad</a>
    </nav>
  );
}
