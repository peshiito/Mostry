import type { EstadoPedido } from '../../../shared/db/tipos/pedidos.js';
import { formatearPlata } from '../../../shared/utils/plata.js';
import { montoAPagar } from './montos.js';

type Datos = {
  numero: number;
  estado: EstadoPedido;
  clienteNombre: string;
  clienteWhatsapp: string;
  total: number;
  sena: number;
};

const TEXTOS: Record<EstadoPedido, (p: Datos) => string> = {
  pendiente_pago: (p) =>
    `recibimos tu pedido #${p.numero}. Para confirmarlo, transferí ${formatearPlata(montoAPagar(p))} y subí el comprobante`,
  comprobante_enviado: (p) =>
    `recibimos tu comprobante del pedido #${p.numero}. En breve lo revisamos`,
  pago_aprobado: (p) =>
    `¡aprobamos tu pago del pedido #${p.numero}! Ya lo estamos por preparar`,
  pendiente_confirmacion: (p) =>
    `recibimos tu encargo #${p.numero}. Te avisamos cuando lo confirmemos`,
  confirmado: (p) => `¡confirmamos tu encargo #${p.numero}!`,
  en_preparacion: (p) => `estamos preparando tu pedido #${p.numero}`,
  en_camino: (p) => `¡tu pedido #${p.numero} va en camino!`,
  listo_retirar: (p) => `¡tu pedido #${p.numero} está listo para retirar!`,
  entregado: (p) => `entregamos tu pedido #${p.numero}. ¡Gracias por tu compra!`,
  cancelado: (p) => `tu pedido #${p.numero} se canceló. Cualquier duda, escribinos`,
};

// Botón "Avisar por WhatsApp" del panel: wa.me con el mensaje y el link de
// seguimiento ya armados (no usamos la API de WhatsApp, sección 6.1).
export function linkWhatsapp(p: Datos, tienda: string, seguimiento: string) {
  const texto = `¡Hola ${p.clienteNombre}! Te escribimos de ${tienda}: ${TEXTOS[p.estado](p)}.\n\nSeguilo acá: ${seguimiento}`;
  return `https://wa.me/${p.clienteWhatsapp}?text=${encodeURIComponent(texto)}`;
}
