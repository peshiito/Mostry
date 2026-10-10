import { BARRA, CUERPO, RAYAS, VISTA_TOLDO } from './formas.js';

const BORDE = { stroke: 'var(--logo-borde)', strokeWidth: 8, strokeLinejoin: 'round' };

// El toldo de Mostry, vectorial: se ve nítido en cualquier tamaño.
// `ancho` en px; el alto sale de la proporción del dibujo (621×278).
export function Toldo({ ancho = 32 }) {
  return (
    <svg
      width={ancho}
      height={(ancho * 278) / 621}
      viewBox={VISTA_TOLDO}
      aria-hidden="true"
      overflow="visible"
    >
      <path d={CUERPO} style={{ fill: 'var(--logo-lona)', ...BORDE }} />
      {RAYAS.map((d) => (
        <path key={d} d={d} style={{ fill: 'var(--logo-raya)' }} />
      ))}
      <rect
        x={BARRA.x}
        y={BARRA.y}
        width={BARRA.w}
        height={BARRA.h}
        rx={BARRA.r}
        style={{ fill: 'var(--logo-barra)' }}
      />
    </svg>
  );
}
