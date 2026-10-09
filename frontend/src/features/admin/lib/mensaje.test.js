import { describe, expect, it } from 'vitest';
import { armarMensaje, plantillaSugerida, textoDias } from './mensaje.js';

const tienda = {
  nombre: 'La Espiga',
  slug: 'la-espiga',
  nombreDueno: 'Rosa Martínez',
  venceEl: '2026-10-11T03:00:00.000Z',
  diasRestantes: 2,
  estado: 'prueba',
  planHasta: null,
};
const datos = { precio: 1000000, alias: 'mostry.pagos', titular: 'Pedro Báez' };

describe('mensajes de WhatsApp del admin', () => {
  it('completa las variables con los datos de la tienda y de Mostry', () => {
    const texto =
      'Hola {dueno}, {tienda} vence ({dias}). Pagá {precio} a {alias} ({titular}).';
    expect(armarMensaje(texto, tienda, datos)).toBe(
      'Hola Rosa, La Espiga vence (te quedan 2 días). Pagá $ 10.000 a mostry.pagos (Pedro Báez).',
    );
  });

  it('sin nombre del dueño saluda igual y deja a la vista lo desconocido', () => {
    const t = armarMensaje(
      'Hola {dueno}, {otra}',
      { ...tienda, nombreDueno: null },
      datos,
    );
    expect(t).toBe('Hola, {otra}');
  });

  it('dice los días en criollo y sugiere la plantilla según el estado', () => {
    expect([0, 1, 5].map(textoDias)).toEqual([
      'vence hoy',
      'vence mañana',
      'te quedan 5 días',
    ]);
    expect(plantillaSugerida(tienda)).toBe('vence_prueba');
    expect(
      plantillaSugerida({ ...tienda, estado: 'activa', planHasta: '2026-11-01' }),
    ).toBe('vence_plan');
  });
});
