import { z } from 'zod';
import { TRANSICIONES_MANUALES, type EstadoManual } from './servicios/estados.js';

const ESTADOS = [
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

export const esquemaId = z.coerce.number().int().positive();

export const esquemaFiltrosPedidos = z.strictObject({
  estado: z.enum(ESTADOS).optional(),
  tipo: z.enum(['inmediato', 'encargo']).optional(),
  pagina: z.coerce.number().int().min(1).max(1000).default(1),
});

const medio = z.enum(['efectivo', 'transferencia']);

// Estados que el comerciante pone a mano (el resto los ponen comprobantes y cobros).
// Al entregar un encargo con resto pendiente, se indica cómo se cobró (sección 6.2).
export const esquemaAvanzar = z.strictObject({
  // Se deriva de la máquina de estados: si cambia una, cambia la otra.
  estado: z.enum(Object.keys(TRANSICIONES_MANUALES) as [EstadoManual, ...EstadoManual[]]),
  medioCobro: medio.optional(),
});

// Si el comprador ya había pagado y se le devolvió la plata, queda el egreso (decisión 26).
export const esquemaCancelar = z.strictObject({
  motivo: z.string().trim().min(3).max(200),
  devolucion: z.strictObject({ medio }).optional(),
});
