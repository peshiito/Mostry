import { describe, expect, it } from 'vitest';
import { adaptarTienda } from './adaptar.js';

describe('adaptarTienda', () => {
  // La API manda solo lo mínimo de una tienda suspendida (sin horarios ni
  // promociones): antes esto rompía la vidriera y quedaba en blanco.
  it('una tienda suspendida se adapta sin romper', () => {
    const t = {
      nombre: 'Doña Rosa',
      frase: null,
      logoUrl: null,
      paleta: 'toldo',
      disponible: false,
    };
    expect(adaptarTienda(t, 'dona-rosa')).toEqual({
      estado: 'suspendida',
      tienda: {
        slug: 'dona-rosa',
        nombre: 'Doña Rosa',
        frase: null,
        logoUrl: null,
        paleta: 'toldo',
      },
    });
  });
});
