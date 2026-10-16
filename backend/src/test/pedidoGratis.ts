import { sql } from 'kysely';
import { db } from '../shared/db/db.js';
import { clubTienda, darSellos, programaTest } from './clubTienda.js';
import { pedido } from './tiendaLista.js';

// Ana usa un premio del 100 %: su pedido de 2 medialunas queda en $ 0,
// esperando que la tienda lo confirme (reserva stock y no tiene plazo propio).
export async function pedidoGratisDeAna() {
  const t = await clubTienda();
  const premio = { compras: 1, tipo: 'porcentaje', valor: 100, tope: null };
  await t.panel.put('/panel/club', {
    ...programaTest,
    premios: [{ ...premio, descripcion: null }],
  });
  await darSellos(1);
  const datos = pedido(t.productos, { medialuna: 2 }, { premio: 1, totalEsperado: 0 });
  await t.comoAna('/publico/pedidos', datos).expect(201);
  return t;
}

// Atrasa la creación de los pedidos (la columna no se actualiza desde el código).
export const atrasarPedidos = (horas: number) =>
  sql`UPDATE pedidos SET creado_en = DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${horas * 60} MINUTE)`.execute(
    db,
  );
