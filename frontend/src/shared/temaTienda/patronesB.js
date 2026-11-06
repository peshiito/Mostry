// Fondos de la vidriera (V3), parte 2.
const svg = (w, h, cuerpo) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${cuerpo}</svg>`;

export const PATRONES_B = {
  ladrillo: (t) =>
    svg(
      48,
      24,
      `<path d='M0 .5H48M0 12.5H48M.5 0V12M24.5 12V24' stroke='${t}' stroke-width='1' fill='none'/>`,
    ),
  madera: (t) =>
    svg(
      120,
      40,
      `<g fill='none' stroke='${t}' stroke-width='1'><path d='M0 8q30 6 60 0t60 0'/><path d='M0 22q30-5 60 1t60-1'/><path d='M0 34q30 4 60-1t60 1'/></g>`,
    ),
  pizarra: (t) =>
    svg(
      90,
      90,
      `<g fill='none' stroke='${t}' stroke-width='1.4' stroke-linecap='round'><path d='M8 20l14-2'/><path d='M50 12l10 3'/><path d='M30 60l18 1'/><path d='M70 72l9-4'/></g>`,
    ),
  kraft: (t) =>
    svg(
      50,
      50,
      `<g stroke='${t}' stroke-width='0.8'><path d='M4 10l8 1M30 4l6 2M18 30l9-1M40 38l6 3M8 44l5-2'/></g>`,
    ),
  flores: (t, a) =>
    svg(
      64,
      64,
      `<g fill='${t}'><circle cx='16' cy='12' r='3'/><circle cx='22' cy='16' r='3'/><circle cx='16' cy='20' r='3'/><circle cx='10' cy='16' r='3'/></g><circle cx='16' cy='16' r='2' fill='${a}'/><circle cx='48' cy='46' r='2.2' fill='${t}'/>`,
    ),
  toldo: (t) => svg(40, 40, `<rect width='20' height='40' fill='${t}'/>`),
  ondas: (t) =>
    svg(
      60,
      24,
      `<path d='M0 12q15-10 30 0t30 0' fill='none' stroke='${t}' stroke-width='1.4'/>`,
    ),
};
