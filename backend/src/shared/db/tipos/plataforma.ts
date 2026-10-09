import type { ColumnType } from 'kysely';
import type { Auto, ColTienda, Creado } from './comunes.js';

// Tablas de la plataforma Mostry: plantillas (sin tienda) y reportes/soporte
// (son de una tienda, pero las lee o usa el admin).
export type PlantillasMensajeTabla = {
  clave: string;
  texto: string;
  actualizadoEn: Auto<Date>;
};

export const ESTADOS_REPORTE = ['nuevo', 'en_curso', 'resuelto'] as const;
export type EstadoReporte = (typeof ESTADOS_REPORTE)[number];

// Reporte de un problema: es de una tienda (tiendaId marcado) pero lo lee el admin.
export type ReportesTabla = {
  id: Auto<number>;
  tiendaId: ColTienda;
  numero: number;
  usuarioId: number;
  pantalla: string;
  descripcion: string;
  claveCaptura: string | null;
  navegador: string | null;
  estado: Auto<EstadoReporte>;
  respuesta: string | null;
  creadoEn: Auto<Date>;
  actualizadoEn: Auto<Date>;
};

// Permiso de soporte (1 hora) que da el comercio y lo que hizo Mostry con él.
export type AccesosSoporteTabla = {
  id: Auto<number>;
  tiendaId: ColTienda;
  otorgadoPor: number;
  creadoEn: Auto<Date>;
  venceEn: Date;
  revocadoEn: Date | null;
};

// Registro de auditoría: se inserta y nunca se modifica (el comercio confía en él).
type Fijo<T> = ColumnType<T, T, never>;
export type RegistroSoporteTabla = Creado & {
  id: Auto<number>;
  tiendaId: ColTienda;
  accesoId: Fijo<number>;
  adminId: Fijo<number>;
  accion: Fijo<string>;
  metodo: Fijo<string>;
  ruta: Fijo<string>;
};
