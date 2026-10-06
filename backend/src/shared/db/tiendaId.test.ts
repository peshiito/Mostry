import { describe, expect, it } from 'vitest';
import { productosRepo } from '../../modules/catalogo/repositorios/productos.repository.js';
import { comoTiendaId } from './tiendaId.js';

// Este test lo "corre" el compilador: si alguna línea con @ts-expect-error
// dejara de dar error, `npm run typecheck` falla.
describe('TiendaId', () => {
  it('un número suelto no sirve como id de tienda', () => {
    const productoId = 7;
    const consultaMal = () =>
      // @ts-expect-error: hay que pasar un TiendaId, no cualquier número
      productosRepo.buscar(productoId, productoId);
    const consultaBien = () => productosRepo.buscar(comoTiendaId(1), productoId);
    expect(typeof consultaMal).toBe('function');
    expect(typeof consultaBien).toBe('function');
  });
});
