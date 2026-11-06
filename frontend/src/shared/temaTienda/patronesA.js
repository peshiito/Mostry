// Fondos de la vidriera (V3), parte 1. Cada uno es un SVG chico que se repite,
// dibujado por Mostry (nunca subido por el usuario). `t` es el trazo, `a` el acento.
const svg = (w, h, cuerpo) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${cuerpo}</svg>`;

export const PATRONES_A = {
  harina: (t) =>
    svg(
      60,
      60,
      `<g fill='${t}'><circle cx='8' cy='12' r='1.4'/><circle cx='38' cy='6' r='1'/><circle cx='26' cy='34' r='1.6'/><circle cx='52' cy='44' r='1.1'/><circle cx='14' cy='50' r='0.9'/></g>`,
    ),
  pared: (t) =>
    svg(
      120,
      120,
      `<g fill='none' stroke='${t}' stroke-width='1.2' stroke-linecap='round'><path d='M10 20q12-8 22 2t20-4'/><path d='M70 70q8 6 18-2'/><path d='M90 18v14M93 24v20'/><path d='M20 90q10 10 26 0'/></g>`,
    ),
  renglones: (t, a) =>
    svg(
      40,
      32,
      `<path d='M0 31.5H40' stroke='${t}' stroke-width='1'/><path d='M6 0V32' stroke='${a}' stroke-opacity='0.5' stroke-width='1'/>`,
    ),
  cuadrille: (t) =>
    svg(
      24,
      24,
      `<path d='M0 .5H24M.5 0V24' stroke='${t}' stroke-width='1' fill='none'/>`,
    ),
  rayas: (t) =>
    svg(
      28,
      28,
      `<path d='M-7 7l14-14M0 28L28 0M21 35l14-14' stroke='${t}' stroke-width='5'/>`,
    ),
  confites: (t, a) =>
    svg(
      70,
      70,
      `<g stroke-width='3.2' stroke-linecap='round'><path d='M10 12l6 4' stroke='${a}'/><path d='M44 8l-3 6' stroke='${t}'/><path d='M30 40l7-2' stroke='${a}'/><path d='M58 52l-4 6' stroke='${t}'/><path d='M14 58l6-3' stroke='${t}'/></g>`,
    ),
  hojas: (t) =>
    svg(
      80,
      80,
      `<g fill='none' stroke='${t}' stroke-width='1.3'><path d='M14 30q10-22 26-14-6 20-26 14zM14 30l20-12'/><path d='M50 66q8-18 22-12-4 16-22 12zM50 66l16-10'/></g>`,
    ),
  puntos: (t) =>
    svg(
      22,
      22,
      `<circle cx='5' cy='5' r='2' fill='${t}'/><circle cx='16' cy='16' r='2' fill='${t}'/>`,
    ),
};
