import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

const medialuna = {
  nombre: 'Medialuna de manteca',
  precio: 35000,
  stock: 120,
  stockMinimo: 24,
};

describe('catálogo: validaciones', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('no acepta una categoría inexistente', async () => {
    const res = await p
      .post('/panel/productos', { ...medialuna, categoriaId: 9999 })
      .expect(400);
    expect(res.body.error.codigo).toBe('categoria_invalida');
  });

  it('valida los filtros', async () => {
    for (const q of [
      'estado=borrados',
      'pagina=0',
      'stockBajo=si',
      'categoriaId=abc',
      'otro=1',
    ]) {
      await p.get(`/panel/productos?${q}`).expect(400);
    }
  });
});
