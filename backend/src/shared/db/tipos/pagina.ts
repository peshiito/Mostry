import type { ColumnType } from 'kysely';
import type { DocumentoPagina } from '../../../modules/tiendas/pagina/esquemaPagina.js';
import type { Auto, ColTienda, DeTienda, Json } from './comunes.js';

// "Armá tu página" (0056): borrador y publicado de la página, más sus versiones.
export type PaginasTiendaTabla = {
  tiendaId: ColTienda;
  borrador: Json<DocumentoPagina>;
  publicado: Json<DocumentoPagina>;
  version: Auto<number>;
  actualizadoEn: ColumnType<Date, Date | undefined, Date>;
  publicadoEn: ColumnType<Date | null, Date | null | undefined, Date | null>;
};

export type VersionesPaginaTabla = DeTienda & {
  documento: ColumnType<DocumentoPagina, string, never>;
  creadaEn: ColumnType<Date, never, never>;
};

// Biblioteca de imágenes de la tienda (0057). `clave` es la base de los archivos.
export type MediosTiendaTabla = DeTienda & {
  clave: string;
  tipo: 'foto' | 'animado';
  ancho: number;
  alto: number;
  bytes: number;
  creadoEn: ColumnType<Date, never, never>;
};
