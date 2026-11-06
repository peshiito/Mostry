import type { Auto, ColTienda, Creado, Fecha } from './comunes.js';

// Pagos del plan y días de cortesía (S1, 0052).
export type PagosSuscripcionTabla = Creado & {
  id: Auto<number>;
  tiendaId: ColTienda;
  tipo: Auto<'pago' | 'cortesia'>;
  monto: number;
  pagadoEn: Fecha;
  periodoDesde: Date;
  periodoHasta: Date;
  registradoPor: number;
  nota: string | null;
};
