import { describe, expect, it } from 'vitest';
import { avisoReporte } from './avisoWhatsapp.js';

describe('avisoReporte', () => {
  const r = { numero: 3, tienda: 'La Espiga', descripcion: 'No puedo cerrar la caja.' };

  it('arma el link de WhatsApp a Mostry con el número de reporte', () => {
    const link = avisoReporte(r, '5491125303909');
    expect(link).toMatch(/^https:\/\/wa\.me\/5491125303909\?text=/);
    expect(decodeURIComponent(link.split('text=')[1])).toContain('reporte #3');
  });

  it('sin número configurado no hay botón', () => {
    expect(avisoReporte(r, '')).toBeNull();
  });
});
