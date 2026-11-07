import { beforeEach, describe, expect, it } from 'vitest';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { paginaDePrueba } from './paginaDePrueba.js';

// "Armá tu página" (P4): el carrito apagado y los bloques nuevos.
describe('página de la tienda: ajustes y bloques de productos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const publicar = async (p: object) => {
    await t.panel.put('/panel/tienda/pagina/borrador', p).expect(200);
    await t.panel.post('/panel/tienda/pagina/publicar').expect(200);
  };
  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('sin carrito, la API no acepta pedidos; con carrito, sí', async () => {
    const sinCarrito = paginaDePrueba();
    sinCarrito.ajustes.carrito = false;
    await publicar(sinCarrito);
    const r = await t.comprador.post(
      '/publico/pedidos',
      pedido(t.productos, { medialuna: 1 }),
    );
    expect(r.status).toBe(409);
    expect(r.body.error.codigo).toBe('sin_carrito');
    await publicar(paginaDePrueba());
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
      .expect(201);
  });

  it('acepta el producto destacado y las categorías elegidas; rechaza datos malos', async () => {
    const p = paginaDePrueba() as ReturnType<typeof paginaDePrueba> & {
      bloques: object[];
    };
    p.bloques.push(
      {
        id: 'desta1',
        tipo: 'destacado',
        visible: true,
        datos: {
          productoId: t.productos.rogel,
          titulo: null,
          texto: null,
          lado: 'izquierda',
        },
      },
      {
        id: 'categ1',
        tipo: 'categorias',
        visible: true,
        datos: { titulo: null, forma: 'tarjetas', ids: [1, 2] },
      },
    );
    await t.panel.put('/panel/tienda/pagina/borrador', p).expect(200);
    const malos = [
      { productoId: 0, titulo: null, texto: null, lado: 'izquierda' },
      { titulo: null, texto: null, lado: 'izquierda' },
      { productoId: 1, titulo: null, texto: null, lado: 'arriba' },
    ];
    for (const datos of malos) {
      const m = paginaDePrueba() as typeof p;
      m.bloques.push({ id: 'desta1', tipo: 'destacado', visible: true, datos });
      await t.panel.put('/panel/tienda/pagina/borrador', m).expect(400);
    }
  });
});
