import { PALETAS } from '../lib/paletas.js';

// Temas armados de la vidriera (D0, diseñados con Stitch). El comercio arranca de
// uno y después cambia lo que quiera. Columnas: clave | nombre | para quién |
// principal | acento | fondo | títulos | texto | forma | encabezado | patrón.
const TABLA = `
horno|Horno|Panaderías y cocina casera|#7a4a2a|#e0a526|#f6eedf|vollkorn|nunito-sans|suave|toldo|harina
calle|Calle|Ropa urbana, zapatillas y gorras|#f5e21b|#ff5a1f|#141414|marker|space-grotesk|recta|portada|pared
cuaderno|Cuaderno|Librería y útiles escolares|#2f5bd3|#ffc93c|#ffffff|patrick|nunito|redonda|minimo|renglones
boutique|Boutique|Ropa y accesorios|#161616|#b08a5a|#f7f4ef|playfair|inter|recta|portada|ninguno
kiosco|Kiosco|Almacén, kiosco y despensa|#d7263d|#ffd23f|#fff8e7|bebas|archivo|suave|toldo|rayas
dulce|Dulce|Heladería, pastelería y golosinas|#c2185b|#7fd8c3|#ffe8ef|fredoka|nunito|redonda|minimo|confites
huerta|Huerta|Verdulería y productos naturales|#2e7d32|#f26b38|#f4f1e8|bricolage|dm-sans|suave|minimo|hojas
bodega|Bodega|Bebidas, vinos y gaseosas|#b23a48|#e8b04b|#0f1b2d|oswald|inter|suave|portada|ninguno`;

const fila = (linea) => {
  const [
    clave,
    nombre,
    para,
    principal,
    acento,
    fondo,
    titulos,
    texto,
    forma,
    encabezado,
    patron,
  ] = linea.split('|');
  return {
    clave,
    nombre,
    para,
    tema: {
      base: clave,
      colores: { principal, acento, fondo },
      fuentes: { titulos, texto },
      forma,
      encabezado,
      fondo: { tipo: patron === 'ninguno' ? 'liso' : 'patron', patron, intensidad: 40 },
      plantilla: 'clasica',
    },
  };
};

export const TEMAS = TABLA.trim().split('\n').map(fila);

// Las 10 paletas de antes pasan a ser temas "Clásico" con su color (así ninguna
// tienda cambia de golpe al pasar al motor nuevo).
export function temaDePaleta(clave = 'toldo') {
  const p = PALETAS[clave] ?? PALETAS.toldo;
  return {
    base: 'clasico',
    colores: {
      principal: p.principal.toLowerCase(),
      acento: p.acento.toLowerCase(),
      fondo: '#f7f3ec',
    },
    fuentes: { titulos: 'rubik', texto: 'work-sans' },
    forma: 'suave',
    encabezado: 'toldo',
    fondo: { tipo: 'liso', patron: 'ninguno', intensidad: 40 },
    plantilla: 'clasica',
  };
}

// El tema que se usa: el guardado, o el que sale de la paleta vieja.
export const temaEfectivo = (tienda) => tienda?.tema ?? temaDePaleta(tienda?.paleta);
