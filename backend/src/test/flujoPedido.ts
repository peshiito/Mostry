import { db } from '../shared/db/db.js';
import { datosAprobacion, idPedido, subirComprobante } from './comprobantes.js';
import { png } from './imagenes.js';
import { pedido, type tiendaLista } from './tiendaLista.js';

type Tienda = Awaited<ReturnType<typeof tiendaLista>>;
const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

// Lleva un pedido por la API real: checkout → comprobante → (opcional) aprobación.
export async function pedidoHasta(
  t: Tienda,
  hasta: 'comprobante_enviado' | 'pago_aprobado',
  tipo: 'inmediato' | 'encargo' = 'inmediato',
) {
  const datos =
    tipo === 'inmediato'
      ? pedido(t.productos, { medialuna: 2 })
      : pedido(t.productos, { rogel: 1 }, { tipo: 'encargo', fechaEncargo: enDias(3) });
  const creado = (await t.comprador.post('/publico/pedidos', datos).expect(201)).body;
  const numero = creado.numero as number;
  await subirComprobante(t.app, 'dona-rosa', creado.token, await png()).expect(201);
  const id = await idPedido(numero);
  const [c] = (await t.panel.get(`/panel/pedidos/${id}/comprobantes`)).body;
  if (hasta === 'pago_aprobado') {
    await t.panel
      .post(
        `/panel/pedidos/${id}/comprobantes/${c.id}/aprobar`,
        datosAprobacion(creado.pago.monto),
      )
      .expect(200);
  }
  return {
    id,
    token: creado.token as string,
    comprobanteId: c.id as number,
    monto: creado.pago.monto as number,
    total: creado.total as number,
  };
}

export const stockDe = (productoId: number) =>
  db
    .selectFrom('productos')
    .select(['stock', 'stockReservado'])
    .where('id', '=', productoId)
    .executeTakeFirstOrThrow();
