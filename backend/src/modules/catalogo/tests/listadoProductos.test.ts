import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

type Producto = { nombre: string };
const nombres = (body: { productos: Producto[] }) => body.productos.map((x) => x.nombre);

describe('panel: listado y filtros de productos', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let facturas: number;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    facturas = (await p.post('/panel/categorias', { nombre: 'Facturas' })).body.id;
    const productos = [
      {
        nombre: 'Medialuna',
        precio: 1,
        stock: 100,
        stockMinimo: 24,
        categoriaId: facturas,
      },
      {
        nombre: 'Bola de fraile',
        precio: 1,
        stock: 3,
        stockMinimo: 10,
        categoriaId: facturas,
      },
      { nombre: 'Pan francés', precio: 1, stock: 30 },
      { nombre: 'Chipá', precio: 1, stock: 8, activo: false },
    ];
    for (const prod of productos) await p.post('/panel/productos', prod).expect(201);
  });

  it('por defecto muestra solo los activos, ordenados por nombre', async () => {
    const { body } = await p.get('/panel/productos').expect(200);
    expect(nombres(body)).toEqual(['Bola de fraile', 'Medialuna', 'Pan francés']);
    expect(body).toMatchObject({ total: 3, pagina: 1, paginas: 1 });
  });

  it('filtra por categoría, sin categoría, inactivos y búsqueda', async () => {
    expect(
      nombres((await p.get(`/panel/productos?categoriaId=${facturas}`)).body),
    ).toHaveLength(2);
    expect(nombres((await p.get('/panel/productos?categoriaId=sin')).body)).toEqual([
      'Pan francés',
    ]);
    expect(nombres((await p.get('/panel/productos?estado=inactivos')).body)).toEqual([
      'Chipá',
    ]);
    expect(nombres((await p.get('/panel/productos?buscar=media')).body)).toEqual([
      'Medialuna',
    ]);
  });

  it('alerta de stock bajo (para el inicio del panel)', async () => {
    const { body } = await p.get('/panel/productos?stockBajo=true').expect(200);
    expect(nombres(body)).toEqual(['Bola de fraile']);
    expect(body.productos[0].stockBajo).toBe(true);
  });
});
