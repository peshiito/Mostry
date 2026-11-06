// Colores en hex (#rrggbb) y contraste WCAG. Lo usa el motor de temas para que,
// elija el comercio el color que elija, todo texto se lea (≥ 4.5:1).
const canal = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
export const aRgb = (hex) => [0, 1, 2].map((i) => canal(hex, i));
const aHex = (rgb) =>
  `#${rgb
    .map((c) =>
      Math.round(Math.min(255, Math.max(0, c)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

export const esHex = (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

// Luminancia relativa (WCAG 2.x).
export function luminancia(hex) {
  const [r, g, b] = aRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

// Mezcla en sRGB: t = 0 da `a`, t = 1 da `b`.
export const mezclar = (a, b, t) => {
  const [ra, rb] = [aRgb(a), aRgb(b)];
  return aHex(ra.map((c, i) => c + (rb[i] - c) * t));
};

export const esOscuro = (hex) => luminancia(hex) < 0.18;

const BLANCO = '#ffffff';
const NEGRO = '#161616';

// El texto (blanco o casi negro) que mejor se lee sobre `fondo`.
export const textoSobre = (fondo) =>
  contraste(BLANCO, fondo) >= contraste(NEGRO, fondo) ? BLANCO : NEGRO;

// Corre `color` hacia blanco o negro (lo que lo aleje del fondo) hasta llegar al
// contraste pedido. Si ya alcanza, lo devuelve igual.
export function ajustar(color, fondo, minimo = 4.5) {
  if (contraste(color, fondo) >= minimo) return color;
  const destino = esOscuro(fondo) ? BLANCO : NEGRO;
  for (let t = 0.05; t <= 1; t += 0.05) {
    const c = mezclar(color, destino, t);
    if (contraste(c, fondo) >= minimo) return c;
  }
  return destino;
}
