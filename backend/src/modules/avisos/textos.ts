import type { TipoAviso } from '../../shared/db/tipos/avisos.js';

type PedidoAviso = {
  id: number;
  numero: number;
  clienteNombre: string;
  entrega: 'envio' | 'retiro';
  fechaEncargo: Date | null;
};

// "sáb 18/10 16:00", en hora argentina.
const cuando = (f: Date) =>
  f
    .toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');

// Lo que se ve en la pantalla bloqueada: número y nombre de pila. Nada de
// plata, direcciones ni links de seguimiento.
export function textoAviso(tipo: Exclude<TipoAviso, 'resumen'>, p: PedidoAviso) {
  const nombre = p.clienteNombre.trim().split(/\s+/)[0] ?? 'Cliente';
  const url = `/panel/pedidos/${p.id}`;
  const tag = `pedido-${p.id}`;
  if (tipo === 'comprobante')
    return {
      titulo: '🧾 Comprobante para revisar',
      cuerpo: `Pedido #${p.numero} · ${nombre}`,
      url: `${url}/comprobante`,
      tag,
    };
  if (tipo === 'encargo_nuevo')
    return {
      titulo: `🎂 Encargo por aceptar #${p.numero}`,
      cuerpo: `${nombre} · ${p.fechaEncargo ? cuando(p.fechaEncargo) : ''}`.trim(),
      url,
      tag,
    };
  const entrega = p.entrega === 'envio' ? 'para enviar' : 'retira en el local';
  return {
    titulo: `🛍️ Nuevo pedido #${p.numero}`,
    cuerpo: `${nombre} · ${entrega}`,
    url,
    tag,
  };
}
