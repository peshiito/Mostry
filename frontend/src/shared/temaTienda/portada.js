import { ajustar, esOscuro, mezclar, textoSobre } from './color.js';
import { rellenoLegible } from './rellenos.js';

// Relleno de la portada y su texto. En modo oscuro, un tema claro NO aclara su
// color a pastel (eso queda raro sobre la página negra): lo hunde hacia el
// fondo, así la portada sigue siendo "la marca" pero de noche.
export function tokensPortada(colores, modo) {
  const deNoche = modo === 'oscuro' && !esOscuro(colores.fondo);
  const base =
    deNoche && !esOscuro(colores.principal)
      ? mezclar(colores.principal, '#0f1412', 0.55)
      : colores.principal;
  const fondo = rellenoLegible(base);
  const texto = textoSobre(fondo);
  return {
    '--portada-fondo': fondo,
    '--sobre-portada': texto,
    '--sobre-portada-2': ajustar(mezclar(texto, fondo, 0.22), fondo, 4.5),
  };
}
