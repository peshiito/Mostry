import { createElement } from 'react';
import { ICONOS } from './iconos/index.js';

// Ícono decorativo (aria-hidden). Si transmite información, el texto va al lado
// o en el aria-label del botón que lo contiene.
export function Icono({ nombre, tamano = 24, className }) {
  const svg = ICONOS[nombre];
  if (!svg) throw new Error(`Ícono desconocido: ${nombre}`);
  return createElement(svg, { width: tamano, height: tamano, className });
}
