import { describe, expect, it } from 'vitest';
import { esEncargo, validarDatos } from './validar.js';

const base = {
  nombre: 'Lucía Gómez',
  whatsapp: '11 5555-1234',
  direccion: '',
  linkMaps: '',
};

describe('validarDatos', () => {
  it('acepta datos completos para retiro', () => {
    expect(validarDatos(base, 'retiro')).toEqual({});
  });
  it('pide dirección solo para envío', () => {
    expect(validarDatos(base, 'envio').direccion).toBeDefined();
  });
  it('rechaza links que no son de Google Maps', () => {
    const d = { ...base, linkMaps: 'https://evil.com/maps/x' };
    expect(validarDatos(d, 'retiro').linkMaps).toBeDefined();
  });
});

describe('esEncargo', () => {
  it('es encargo fuera de horario o con productos a pedido', () => {
    expect(esEncargo([{ aceptaEncargo: false }], 'cerrada')).toBe(true);
    expect(esEncargo([{ aceptaEncargo: true }], 'abierta')).toBe(true);
    expect(esEncargo([{ aceptaEncargo: false }], 'abierta')).toBe(false);
  });
});
