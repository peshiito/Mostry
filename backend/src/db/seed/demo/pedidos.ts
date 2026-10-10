import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { sesion, type Sesion } from './sesion.js';

export type Linea = [nombre: string, cantidad: number];
type Cliente = { nombre: string; whatsapp: string; envio?: string; fechaEncargo?: Date };

// Compra como un cliente desde la vidriera. Si el total no coincide, el servidor
// contesta 409 con el total real y se reenvía con ese (igual que el navegador).
export async function comprar(
  slug: string,
  producto: (n: string) => number,
  lineas: Linea[],
  c: Cliente,
) {
  const vidriera = await sesion(slug);
  const cuerpo = {
    tipo: c.fechaEncargo ? 'encargo' : 'inmediato',
    clienteNombre: c.nombre,
    clienteWhatsapp: c.whatsapp,
    entrega: c.envio ? 'envio' : 'retiro',
    ...(c.envio && { direccion: c.envio }),
    ...(c.fechaEncargo && { fechaEncargo: c.fechaEncargo.toISOString() }),
    items: lineas.map(([n, cantidad]) => ({ productoId: producto(n), cantidad })),
    totalEsperado: 0,
  };
  const r = await vidriera
    .post('/publico/pedidos', cuerpo)
    .catch(async (e: { body?: { error?: { detalle?: { total?: number } } } }) => {
      const total = e.body?.error?.detalle?.total;
      if (total === undefined) throw e;
      return vidriera.post('/publico/pedidos', { ...cuerpo, totalEsperado: total });
    });
  return { ...r, vidriera };
}
export type Compra = Awaited<ReturnType<typeof comprar>>;

// El comprador sube la captura de la transferencia desde su link de seguimiento.
export const subirComprobante = (c: Compra, imagen: Buffer) =>
  c.vidriera.subir(`/publico/pedidos/${c.token}/comprobante`, 'comprobante', imagen);

// La comerciante aprueba el comprobante con los datos de la transferencia.
export async function aprobar(
  rosa: Sesion,
  tiendaId: TiendaId,
  c: Compra,
  titular: string,
) {
  const id = await idPedido(tiendaId, c.numero);
  const [comp] = (await rosa.get(`/panel/pedidos/${id}/comprobantes`)) as {
    id: number;
  }[];
  await rosa.post(`/panel/pedidos/${id}/comprobantes/${comp!.id}/aprobar`, {
    monto: c.pago.monto,
    fechaOperacion: new Date().toISOString(),
    titular,
    numeroOperacion: String(400_000_000 + c.numero), // inventado, pero siempre igual
  });
  return id;
}

export async function idPedido(tiendaId: TiendaId, numero: number) {
  const p = await db
    .selectFrom('pedidos')
    .select('id')
    .where('tiendaId', '=', tiendaId)
    .where('numero', '=', numero)
    .executeTakeFirstOrThrow();
  return p.id;
}
