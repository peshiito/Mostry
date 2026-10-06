import css from './LogoMostry.module.css';

// Logo "Toldo": rayas verticales verde y crema, festón de 6 semicírculos y barra coral.
// PROVISORIO: se reemplaza por el SVG oficial de Pedro cuando lo pase.
const RAYAS = [0, 1, 2, 3, 4, 5];
// Colores de la marca Mostry (no los de la tienda): cambian con el modo oscuro.
const VERDE = { fill: 'var(--marca-verde)' };
const CREMA = { fill: 'var(--marca-crema)' };

export function LogoMostry({ claro, conTexto = true, tamano = 32 }) {
  return (
    <span className={`${css.logo} ${claro ? css.claro : ''}`}>
      <svg width={tamano} height={tamano} viewBox="0 0 48 48" aria-hidden="true">
        <rect x="0" y="4" width="48" height="5" rx="2" style={VERDE} />
        {RAYAS.map((i) => (
          <g key={i} style={i % 2 ? CREMA : VERDE}>
            <rect x={i * 8} y="9" width="8" height="17" />
            <path d={`M${i * 8} 26a4 4 0 0 0 8 0z`} />
          </g>
        ))}
        <rect
          x="0"
          y="9"
          width="48"
          height="21"
          fill="none"
          style={{ stroke: 'var(--marca-verde)' }}
        />
        <rect
          x="4"
          y="36"
          width="40"
          height="6"
          rx="3"
          style={{ fill: 'var(--coral)' }}
        />
      </svg>
      {conTexto ? <span className={css.texto}>mostry</span> : null}
    </span>
  );
}
