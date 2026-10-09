import type { Auto, Creado, DeTienda, Timestamps } from './comunes.js';

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
  };

export type PedidoItemsTabla = DeTienda & {
  pedidoId: number;
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
};

export type ComprobantesTabla = DeTienda &
  Creado & {
    pedidoId: number;
    tipo: 'pago' | 'sena';
    archivoClave: string | null;
    archivoTipo: 'jpg' | 'png' | 'pdf';
    estado: Auto<'pendiente' | 'aprobado' | 'rechazado'>;
    monto: number | null;
    fechaOperacion: Date | null;
    titular: string | null;
    numeroOperacion: string | null;
    motivoRechazo: string | null;
    revisadoPor: number | null;
    aprobadoEn: Date | null;
    rechazadoEn: Date | null;
    archivoBorrarEn: Date | null;
    archivoBorradoEn: Date | null;
  };
