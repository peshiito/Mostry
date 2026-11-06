import { PALETAS } from '../lib/paletas.js';
import { TABLA_TEMAS } from './tablaTemas.js';

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

export const TEMAS = TABLA_TEMAS.trim().split('\n').map(fila);

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
// "Calle" pasó a llamarse Street: los temas guardados con la clave vieja siguen andando.
const ALIAS = { calle: 'street' };
export const temaEfectivo = (tienda) => {
  const tema = tienda?.tema ?? temaDePaleta(tienda?.paleta);
  return ALIAS[tema.base] ? { ...tema, base: ALIAS[tema.base] } : tema;
};
