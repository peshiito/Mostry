import { describe, expect, it } from 'vitest';
import { aCuerpo, faltante, FORM_ENCARGO, totalEstimado } from './nuevoEncargo.js';

const lleno = {
  ...FORM_ENCARGO,
  nombre: 'Marta Ruiz',
  whatsapp: '11 2345-6789',
  fecha: '2026-10-20',
  hora: '16:30',
  cantidades: { 7: 1, 8: 0 },
  notas: { 7: ' Con frutillas ' },
};

describe('nuevo encargo (panel)', () => {
  it('arma el cuerpo con la hora de Argentina, solo lo elegido y la seña en centavos', () => {
    expect(aCuerpo({ ...lleno, conSena: true, sena: '10000' })).toEqual({
      clienteNombre: 'Marta Ruiz',
      clienteWhatsapp: '11 2345-6789',
      entrega: 'retiro',
      fechaEncargo: '2026-10-20T19:30:00.000Z',
      items: [{ productoId: 7, cantidad: 1, personalizacion: 'Con frutillas' }],
      sena: { monto: 1000000, medio: 'efectivo' },
    });
  });

  it('dice qué falta y estima el total con el envío', () => {
    expect(faltante(FORM_ENCARGO)).toBe('Falta el nombre del cliente.');
    expect(faltante({ ...lleno, cantidades: {} })).toBe('Sumá al menos un producto.');
    expect(faltante({ ...lleno, conSena: true, sena: '' })).toMatch(/seña/);
    expect(faltante(lleno)).toBeNull();
    const productos = [{ id: 7, precio: 2800000 }];
    expect(totalEstimado({ ...lleno, entrega: 'envio' }, productos, 150000)).toBe(
      2950000,
    );
  });
});
