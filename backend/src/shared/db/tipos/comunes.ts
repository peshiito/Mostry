import type { ColumnType, Generated } from 'kysely';

// Columnas que MySQL completa solo (id, creado_en, defaults).
export type Auto<T> = Generated<T>;
// DATE de MySQL viaja como 'YYYY-MM-DD'.
export type Fecha = string;
// TIME de MySQL viaja como 'HH:MM:SS'.
export type Hora = string;
export type Creado = { creadoEn: ColumnType<Date, never, never> };
export type Timestamps = Creado & { actualizadoEn: ColumnType<Date, never, never> };
