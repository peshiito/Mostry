import { describe, expect, it } from 'vitest';
import { responsable, urlPrivacidad, urlTerminos, VERSION_LEGAL } from './legal.js';

describe('legal', () => {
  it('sin datos en el .env avisa "a completar" en lugar de inventar', () => {
    expect(responsable({ VITE_LEGAL_CUIT: '' })).toEqual({
      nombre: 'a completar',
      cuit: 'a completar',
      email: 'a completar',
    });
  });

  it('con los datos del .env los usa tal cual', () => {
    const r = responsable({ VITE_LEGAL_NOMBRE: 'Ana', VITE_LEGAL_CUIT: '20-1-3' });
    expect(r).toMatchObject({ nombre: 'Ana', cuit: '20-1-3' });
  });

  it('los documentos viven en el sitio, con la versión como fecha', () => {
    expect(urlTerminos()).toMatch(/\/\/[^/]+\/terminos$/);
    expect(urlPrivacidad()).toMatch(/\/\/[^/]+\/privacidad$/);
    expect(VERSION_LEGAL).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
