import { ajustar, esOscuro, mezclar } from './color.js';

// Fondo, tarjetas, textos y líneas a partir del fondo del tema. Si el comprador
// usa modo oscuro y el tema es claro, se arma un fondo oscuro teñido del color
// principal (un tema que ya es oscuro se ve igual en los dos modos).
export function fondoEfectivo(colores, modo) {
  if (modo !== 'oscuro' || esOscuro(colores.fondo)) return colores.fondo;
  return mezclar('#0f1412', colores.principal, 0.1);
}

export function superficies(fondo, principal) {
  const oscuro = esOscuro(fondo);
  const papel = oscuro
    ? mezclar(fondo, '#ffffff', 0.07)
    : mezclar(fondo, '#ffffff', 0.75);
  const base = oscuro ? '#f2f2f0' : mezclar('#161616', principal, 0.12);
  // El texto tiene que leerse sobre el fondo Y sobre las tarjetas.
  const legible = (c, min) => ajustar(ajustar(c, fondo, min), papel, min);
  const carbon = legible(base, 7);
  return {
    oscuro,
    '--lona': fondo,
    '--lona-oscura': mezclar(fondo, carbon, 0.05),
    '--papel': papel,
    '--carbon': carbon,
    '--texto-2': legible(mezclar(carbon, fondo, 0.3), 4.5),
    '--texto-3': legible(mezclar(carbon, fondo, 0.4), 4.5),
    '--linea': mezclar(papel, carbon, 0.13),
    '--linea-fuerte': mezclar(papel, carbon, 0.25),
    '--fila-hover': mezclar(papel, carbon, 0.04),
    '--fondo-logo': oscuro ? '#f4f1ea' : '#ffffff',
  };
}

// Colores de estado (errores, ok) en su versión clara u oscura.
export const ESTADOS = {
  claro: {
    '--ladrillo': '#c2412d',
    '--ladrillo-claro': '#fbe4df',
    '--ladrillo-texto': '#8a2a12',
    '--ladrillo-borde': '#efc2b8',
    '--sobre-ladrillo': '#ffffff',
    '--ok': '#1f7a4d',
    '--ok-claro': '#e2f3e9',
    '--ok-borde': '#b9dcc8',
    '--velo': 'rgb(27 27 27 / 0.45)',
  },
  oscuro: {
    '--ladrillo': '#f08a75',
    '--ladrillo-claro': '#3a1f1a',
    '--ladrillo-texto': '#f6ac9c',
    '--ladrillo-borde': '#6e3327',
    '--sobre-ladrillo': '#1b1b1b',
    '--ok': '#6fd39c',
    '--ok-claro': '#14301f',
    '--ok-borde': '#2e5c40',
    '--velo': 'rgb(0 0 0 / 0.6)',
  },
};
