import type { TiendaId } from '../../shared/db/tiendaId.js';
import { randomUUID } from 'node:crypto';

// ÚNICO lugar donde se arman claves del bucket. Todas empiezan con tiendas/{id}/
// y llevan un UUID: nunca dependen del nombre del archivo que manda el usuario.
export const TAMANOS = { grande: 1200, chica: 400 } as const;
export const LADO_LOGO = 512;

export type ClavesFoto = Record<keyof typeof TAMANOS, string>;

export const prefijoTienda = (tiendaId: TiendaId) => `tiendas/${tiendaId}/`;

// "Base" de una foto: en la base de datos se guarda esto, sin tamaño ni extensión.
export const baseFotoProducto = (tiendaId: TiendaId, productoId: number) =>
  `${prefijoTienda(tiendaId)}productos/${productoId}/${randomUUID()}`;

export const clavesDeFoto = (base: string): ClavesFoto => ({
  grande: `${base}-${TAMANOS.grande}.webp`,
  chica: `${base}-${TAMANOS.chica}.webp`,
});

export const claveLogo = (tiendaId: TiendaId) =>
  `${prefijoTienda(tiendaId)}logo/${randomUUID()}.webp`;

export const claveCapturaReporte = (tiendaId: TiendaId, reporteId: number) =>
  `${prefijoTienda(tiendaId)}reportes/${reporteId}/${randomUUID()}.webp`;
