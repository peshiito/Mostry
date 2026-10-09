import type { ColumnType, Generated } from 'kysely';
import type { TiendaId } from '../tiendaId.js';

// Columnas que MySQL completa solo (id, creado_en, defaults).
export type Auto<T> = Generated<T>;
// DATE de MySQL viaja como 'YYYY-MM-DD'.
export type Fecha = string;
// TIME de MySQL viaja como 'HH:MM:SS'.
export type Hora = string;
export type Creado = { creadoEn: ColumnType<Date, never, never> };
export type Timestamps = Creado & { actualizadoEn: ColumnType<Date, never, never> };

// Columna tienda_id: se lee y se inserta como TiendaId (nunca un número suelto)
// y no se puede actualizar: una fila no se muda de tienda (CLAUDE.md 4.1).
export type ColTienda = ColumnType<TiendaId, TiendaId, never>;
// Filas que son de una tienda.
export type DeTienda = { id: Auto<number>; tiendaId: ColTienda };
