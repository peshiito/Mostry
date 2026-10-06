import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { publico } from '../../../test/publico.js';

type P = { nombre: string; disponible: boolean };

describe('tienda pública: catálogo', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let comprador: ReturnType<typeof publico>;
  let facturas: number;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    comprador = publico(ctx.app, 'dona-rosa');
    facturas = (await ctx.panel.post('/panel/categorias', { nombre: 'Facturas' })).body
      .id;
    await ctx.panel.post('/panel/categorias', { nombre: 'Vacía' });
    const productos = [
      {
        nombre: 'Medialuna',
        precio: 35000,
        stock: 10,
        categoriaId: facturas,
        destacado: true,
      },
      { nombre: 'Vigilante', precio: 40000, stock: 0, categoriaId: facturas },
      { nombre: 'Rogel', precio: 2800000, stock: 5, agotado: true, aceptaEncargo: true },
      { nombre: 'Oculto', precio: 1, stock: 5, activo: false },
    ];
    for (const p of productos) await ctx.panel.post('/panel/productos', p).expect(201);
  });

  it('lista solo activos, con "disponible" pero sin el stock', async () => {
    const { body } = await comprador.get('/publico/productos').expect(200);
    const resumen = Object.fromEntries(
      body.productos.map((p: P) => [p.nombre, p.disponible]),
    );
    expect(resumen).toEqual({ Medialuna: true, Rogel: false, Vigilante: false });
    for (const campo of ['stock', 'stockReservado', 'tiendaId'])
      expect(body.productos[0]).not.toHaveProperty(campo);
  });

  it('categorías: solo las que tienen productos; filtros por categoría, búsqueda y destacados', async () => {
    expect((await comprador.get('/publico/categorias')).body).toEqual([
      { id: facturas, nombre: 'Facturas', productos: 2 },
    ]);
    expect(
      (await comprador.get(`/publico/productos?categoriaId=${facturas}`)).body.total,
    ).toBe(2);
    expect(
      (await comprador.get('/publico/productos?buscar=rog')).body.productos[0].nombre,
    ).toBe('Rogel');
    expect((await comprador.get('/publico/productos?destacados=true')).body.total).toBe(
      1,
    );
  });
});
