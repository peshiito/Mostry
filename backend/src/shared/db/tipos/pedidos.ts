import type { Auto, DeTienda, Timestamps } from './comunes.js';

// Única lista de estados: el tipo y los esquemas Zod salen de acá.
export const ESTADOS_PEDIDO = [
  'pendiente_pago',
  'comprobante_enviado',
  'pago_aprobado',
  'pendiente_confirmacion',
  'confirmado',
  'en_preparacion',
  'en_camino',
  'listo_retirar',
  'entregado',
  'cancelado',
] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

export type PedidosTabla = DeTienda &
  Timestamps & {
    numero: number;
    tokenSeguimiento: string;
    tipo: 'inmediato' | 'encargo';
    estado: EstadoPedido;
    clienteNombre: string;
    clienteWhatsapp: string;
    entrega: 'envio' | 'retiro';
    direccion: string | null;
    linkMaps: string | null;
    fechaEncargo: Date | null;
    subtotal: number;
    costoEnvio: Auto<number>;
    total: number;
    sena: Auto<number>;
    venceComprobanteEn: Date | null;
    rechazos: Auto<number>;
    motivoCancelacion: string | null;
    canceladoEn: Date | null;
    entregadoEn: Date | null;
    clienteId: number | null; // cliente del Club (0046)
    descuento: Auto<number>; // premio del Club usado (0047)
  };

export type PedidoItemsTabla = DeTienda & {
  pedidoId: number;
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  reservo: Auto<boolean>; // si reservó stock al comprarse (0038)
  personalizacion: string | null; // cómo lo quiere el comprador (0048)
  fotoClave: string | null; // foto de referencia, bucket privado
  fotoBorrarEn: Date | null;
};

export type { ComprobantesTabla } from './comprobantes.js';
