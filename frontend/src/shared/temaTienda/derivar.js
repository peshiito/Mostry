import { ajustar, mezclar, textoSobre } from './color.js';
import { familiaCss } from './fuentes.js';
import { imagenFondo } from './patrones.js';
import { RADIOS, rellenoLegible } from './rellenos.js';
import { ESTADOS, fondoEfectivo, superficies } from './superficies.js';

// Del tema de la tienda a los tokens CSS que ya usa toda la vidriera (--verde,
// --lona, --coral...). Así los componentes no cambian y cualquier combinación
// que elija el comercio respeta el contraste (≥ 4.5:1) en los dos modos.
export function derivarTokens(tema, modo = 'claro') {
  const { colores, fuentes, forma } = tema;
  const fondo = fondoEfectivo(colores, modo);
  const s = superficies(fondo, colores.principal);
  const lona = fondo;
  const papel = s['--papel'];
  // Principal: relleno del encabezado y color de links/pestañas sobre el fondo.
  const verde = ajustar(ajustar(rellenoLegible(colores.principal), lona), papel);
  const sobreVerde = textoSobre(verde);
  const coral = rellenoLegible(colores.acento);
  const mostazaClaro = mezclar(papel, colores.acento, 0.2);
  const [radio, radioChico] = RADIOS[forma] ?? RADIOS.suave;
  const { oscuro, ...superficiesCss } = s;
  const base = { '--lona': lona, '--carbon': s['--carbon'], '--coral': coral };
  return {
    '--patron': imagenFondo(tema, base),
    // El mismo dibujo, pero sobre el color principal (para la portada).
    '--patron-portada': imagenFondo(tema, { '--lona': verde, '--carbon': sobreVerde, '--coral': coral }),
    ...superficiesCss,
    ...ESTADOS[oscuro ? 'oscuro' : 'claro'],
    '--verde': verde,
    '--verde-oscuro': mezclar(verde, oscuro ? '#ffffff' : '#000000', 0.2),
    '--verde-claro': mezclar(papel, verde, 0.12),
    '--sobre-verde': sobreVerde,
    '--sobre-tienda': sobreVerde,
    '--sobre-verde-2': ajustar(mezclar(sobreVerde, verde, 0.22), verde, 4.5),
    '--tinte-sobre-verde': `color-mix(in srgb, ${sobreVerde} 14%, transparent)`,
    '--coral': coral,
    '--coral-presionado': mezclar(coral, oscuro ? '#ffffff' : '#000000', 0.1),
    '--coral-claro': mezclar(papel, coral, 0.15),
    '--sobre-coral': textoSobre(coral),
    '--mostaza': coral,
    '--sobre-mostaza': textoSobre(coral),
    '--mostaza-claro': mostazaClaro,
    '--mostaza-texto': ajustar(colores.acento, mostazaClaro, 4.5),
    '--mostaza-borde': mezclar(mostazaClaro, colores.acento, 0.35),
    '--foco': `0 0 0 3px color-mix(in srgb, ${verde} 45%, transparent)`,
    '--fuente-titulo': familiaCss(fuentes.titulos, "'Rubik Variable'"),
    '--fuente-texto': familiaCss(fuentes.texto),
    '--radio': radio,
    '--radio-chico': radioChico,
    'color-scheme': oscuro ? 'dark' : 'light',
  };
}
