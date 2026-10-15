import { expect } from 'vitest';
import { pedido, tiendaLista } from './tiendaLista.js';

export const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

// Tienda lista + pan en "hay / no hay" y torta "a pedido" (Mejoras 3).
export async function tiendaConFormas() {
  const t = await tiendaLista();
  const crear = async (p: object) =>
    (await t.panel.post('/panel/productos', p).expect(201)).body;
  const pan = await crear({
    nombre: 'Pan',
    precio: 200000,
    modoStock: 'simple',
    stock: 9,
  });
  expect(pan).toMatchObject({ modoStock: 'simple', stock: 0 });
  const torta = await crear({ nombre: 'Torta', precio: 3000000, modoStock: 'a_pedido' });
  expect(torta).toMatchObject({ modoStock: 'a_pedido', aceptaEncargo: true });
  return { ...t, pan: pan.id as number, torta: torta.id as number };
}

// Cuerpo de checkout para un solo producto, con el total que vería el comprador.
export const compra = (
  productoId: number,
  cantidad: number,
  precio: number,
  extra = {},
) => ({
  ...pedido({}, {}),
  items: [{ productoId, cantidad }],
  totalEsperado: precio * cantidad,
  ...extra,
});
