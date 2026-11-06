import { linkWhatsapp } from '../../../shared/lib/linkSeguro.js';

// Del destino guardado en la página ({ tipo, ... }) al link de verdad. Nunca se
// guarda un href suelto: así no entra un javascript: por un botón.
export function enlace(destino, tienda) {
  switch (destino?.tipo) {
    case 'catalogo':
      return { href: '/catalogo', interno: true };
    case 'categoria':
      return { href: `/catalogo?categoria=${destino.id}`, interno: true };
    case 'producto':
      return { href: `/producto/${destino.id}`, interno: true };
    case 'seccion':
      return { href: `#b-${destino.id}` };
    case 'whatsapp': {
      const wa = linkWhatsapp(tienda.whatsapp);
      return wa ? { href: wa, externo: true, icono: 'chat' } : null;
    }
    case 'web':
      return /^https:\/\//.test(destino.url ?? '')
        ? { href: destino.url, externo: true, icono: 'open_in_new' }
        : null;
    default:
      return null;
  }
}

// Botones guardados → botones listos para pintar (los que no tienen destino válido no van).
export const botonesListos = (botones = [], tienda) =>
  botones.flatMap((b) => {
    const e = enlace(b.destino, tienda);
    return e ? [{ ...e, texto: b.texto }] : [];
  });
