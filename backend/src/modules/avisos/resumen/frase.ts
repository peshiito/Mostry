import type { Conteo } from './conteo.js';

const plural = (n: number, uno: string, varios: string) =>
  `${n} ${n === 1 ? uno : varios}`;

// "1 comprobante para revisar · 1 encargo por aceptar · hoy entregás 3 encargos".
export function fraseResumen(c: Conteo) {
  const partes = [
    c.comprobantes
      ? plural(c.comprobantes, 'comprobante', 'comprobantes') + ' para revisar'
      : '',
    c.porAceptar ? plural(c.porAceptar, 'encargo', 'encargos') + ' por aceptar' : '',
    c.encargosHoy ? `hoy entregás ${plural(c.encargosHoy, 'encargo', 'encargos')}` : '',
  ];
  return partes.filter(Boolean).join(' · ');
}

export const totalResumen = (c: Conteo) => c.comprobantes + c.porAceptar + c.encargosHoy;
