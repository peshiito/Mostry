// Tipografías de la vidriera (V2): todas OFL o Apache, alojadas en Mostry (la
// CSP no deja fuentes de afuera). Cada una se baja solo si la tienda la usa
// (cargas.js). Columnas: clave | nombre | familia CSS | estilo | apta para texto.
const TABLA = `
rubik|Rubik|Rubik Variable|moderna|0
work-sans|Work Sans|Work Sans Variable|moderna|1
vollkorn|Vollkorn|Vollkorn Variable|clásica|1
fraunces|Fraunces|Fraunces Variable|clásica|0
young-serif|Young Serif|Young Serif|clásica|0
playfair|Playfair Display|Playfair Display Variable|elegante|0
bodoni|Bodoni Moda|Bodoni Moda Variable|elegante|0
lora|Lora|Lora Variable|elegante|1
bebas|Bebas Neue|Bebas Neue|cartel|0
anton|Anton|Anton|cartel|0
oswald|Oswald|Oswald Variable|cartel|0
marker|Permanent Marker|Permanent Marker|urbana|0
spray|Rubik Spray Paint|Rubik Spray Paint|urbana|0
sedgwick|Sedgwick Ave|Sedgwick Ave Display|urbana|0
patrick|Patrick Hand|Patrick Hand|escolar|0
caveat|Caveat|Caveat Variable|escolar|0
pacifico|Pacifico|Pacifico|casera|0
fredoka|Fredoka|Fredoka Variable|dulce|0
baloo|Baloo 2|Baloo 2 Variable|dulce|0
bricolage|Bricolage Grotesque|Bricolage Grotesque Variable|moderna|0
syne|Syne|Syne Variable|moderna|0
space-grotesk|Space Grotesk|Space Grotesk Variable|moderna|1
nunito-sans|Nunito Sans|Nunito Sans Variable|moderna|1
nunito|Nunito|Nunito Variable|dulce|1
inter|Inter|Inter Variable|moderna|1
archivo|Archivo|Archivo Variable|moderna|1
dm-sans|DM Sans|DM Sans Variable|moderna|1`;

export const FUENTES = TABLA.trim()
  .split('\n')
  .map((linea) => {
    const [clave, nombre, familia, estilo, texto] = linea.split('|');
    return { clave, nombre, familia: `'${familia}'`, estilo, texto: texto === '1' };
  });

const PORCLAVE = Object.fromEntries(FUENTES.map((f) => [f.clave, f]));
export const fuente = (clave) => PORCLAVE[clave] ?? null;
export const FUENTES_TEXTO = FUENTES.filter((f) => f.texto);
export const CLAVES_FUENTES = FUENTES.map((f) => f.clave);

// Familia CSS con respaldos (la fuente propia de la tienda va por `respaldo`).
export const familiaCss = (clave, respaldo = "'Work Sans Variable'") =>
  `${fuente(clave)?.familia ?? respaldo}, system-ui, sans-serif`;
