import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

type Lista = {
  productos: { id: number; nombre: string }[];
  total: number;
  paginas: number;
};

describe('catálogo: paginación y búsqueda', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const listar = async (q: string) =>
    (await p.get(`/panel/productos?${q}`).expect(200)).body as Lista;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('pagina de a 50, sin repetir ni saltear aunque haya nombres iguales', async () => {
    const { id: tiendaId } = (await p.get('/panel/tienda/config')).body;
    const filas = Array.from({ length: 51 }, (_, i) => ({
      tiendaId,
      nombre: i < 20 ? 'Torta' : `Producto ${i}`,
      precio: 1,
    }));
    await db.insertInto('productos').values(filas).execute();

    const [p1, p2, p3] = [
      await listar('pagina=1'),
      await listar('pagina=2'),
      await listar('pagina=3'),
    ];
    expect([p1.productos.length, p2.productos.length, p3.productos.length]).toEqual([
      50, 1, 0,
    ]);
    expect(p1).toMatchObject({ total: 51, paginas: 2 });
    const ids = new Set([...p1.productos, ...p2.productos].map((x) => x.id));
    expect(ids.size).toBe(51);
  });

  it('sin productos: una página vacía', async () => {
    expect(await listar('pagina=1')).toMatchObject({
      productos: [],
      total: 0,
      paginas: 1,
    });
  });

  it('% y _ se buscan literalmente, no como comodines', async () => {
    for (const nombre of ['Pan 50% off', 'Pan_integral', 'Medialuna']) {
      await p.post('/panel/productos', { nombre, precio: 1, stock: 1 }).expect(201);
    }
    expect((await listar('buscar=%25')).productos.map((x) => x.nombre)).toEqual([
      'Pan 50% off',
    ]);
    expect((await listar('buscar=_')).productos.map((x) => x.nombre)).toEqual([
      'Pan_integral',
    ]);
    expect((await listar('buscar=')).total).toBe(3);
  });
});
