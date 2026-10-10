import { PALABRA, VISTA_PALABRA } from './formas.js';

// La palabra "mostry" del logo oficial, en curvas (no depende de la fuente).
// Toma el color del texto que la rodea (currentColor). `alto` en px.
export function PalabraMostry({ alto = 24 }) {
  return (
    <svg
      width={(alto * 751) / 191}
      height={alto}
      viewBox={VISTA_PALABRA}
      role="img"
      aria-label="mostry"
    >
      <path d={PALABRA} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
