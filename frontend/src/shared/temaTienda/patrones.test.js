import { describe, expect, it } from 'vitest';
import { contraste, mezclar } from './color.js';
import { derivarTokens } from './derivar.js';
import { PATRONES } from './patrones.js';
import { TEMAS } from './temas.js';

const conPatron = (patron, intensidad = 100) => ({
  ...TEMAS[0].tema,
  fondo: { tipo: 'patron', patron, intensidad },
});

describe('fondos dibujados', () => {
  it('cada patrón arma un SVG que se puede usar de fondo', () => {
    for (const nombre of Object.keys(PATRONES)) {
      const img = derivarTokens(conPatron(nombre))['--patron'];
      expect(img.startsWith('url("data:image/svg+xml,')).toBe(true);
      expect(decodeURIComponent(img)).not.toMatch(/script|href|on\w+=/i);
    }
  });

  it('sin patrón no hay imagen', () => {
    const liso = {
      ...TEMAS[0].tema,
      fondo: { tipo: 'liso', patron: 'harina', intensidad: 40 },
    };
    expect(derivarTokens(liso)['--patron']).toBe('none');
  });

  it('con la intensidad al máximo, el texto principal se sigue leyendo sobre el trazo', () => {
    for (const { tema } of TEMAS)
      for (const modo of ['claro', 'oscuro']) {
        const t = derivarTokens(tema, modo);
        const trazo = mezclar(t['--lona'], t['--carbon'], 0.14);
        expect(contraste(t['--carbon'], trazo)).toBeGreaterThanOrEqual(4.5);
      }
  });
});
