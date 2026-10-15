import { sesion } from './sesion.js';

// La personalización va solo en lo que la pide (Encargos 2).
export type Linea = [nombre: string, cantidad: number, personalizacion?: string];
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
    items: lineas.map(([n, cantidad, personalizacion]) => ({
      productoId: producto(n),
      cantidad,
      ...(personalizacion && { personalizacion }),
    })),
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
