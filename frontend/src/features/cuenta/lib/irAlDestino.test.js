import { describe, expect, it, vi } from 'vitest';
import { irAlDestino } from './irAlDestino.js';

describe('irAlDestino', () => {
  it('admin → dashboard; una tienda → su panel; varias → la lista', () => {
    const ir = vi.fn();
    irAlDestino({ zona: 'admin' }, ir);
    expect(ir).toHaveBeenLastCalledWith(expect.stringMatching(/\/\/admin\.[^/]+\/$/));
    irAlDestino(
      { zona: 'tiendas', tiendas: [{ slug: 'la-espiga', nombre: 'La Espiga' }] },
      ir,
    );
    expect(ir).toHaveBeenLastCalledWith(
      expect.stringMatching(/\/\/la-espiga\..+\/panel$/),
    );
    const varias = [
      { slug: 'a', nombre: 'A' },
      { slug: 'b', nombre: 'B' },
    ];
    expect(irAlDestino({ zona: 'tiendas', tiendas: varias }, ir)).toEqual(varias);
    expect(ir).toHaveBeenCalledTimes(2);
  });

  it('sin destino (ingreso desde la tienda o el admin) no hace nada', () => {
    expect(irAlDestino(null, vi.fn())).toBeNull();
  });
});
