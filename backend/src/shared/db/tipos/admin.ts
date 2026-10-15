import type { ColumnType } from 'kysely';
import type { Auto } from './comunes.js';

// Constancia de cada ayuda del admin a una tienda (0039). Sin FK a tiendas:
// sobrevive a que la tienda se elimine.
export type RegistroAdminTabla = {
  id: Auto<number>;
  adminId: number;
  tiendaId: number | null;
  tiendaSlug: string;
  accion: string;
  detalle: string | null;
  creadoEn: Auto<Date>;
};

export type PagoResumido = { monto: number; fecha: string; desde: string; hasta: string };

// Resumen sin datos personales de una tienda eliminada (0040).
export type TiendasEliminadasTabla = {
  id: Auto<number>;
  nombre: string;
  slug: string;
  altaEn: Date;
  eliminadaEn: Auto<Date>;
  totalPagado: number;
  pagos: ColumnType<PagoResumido[], string, string>;
};
