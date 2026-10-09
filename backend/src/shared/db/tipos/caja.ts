import type { Auto, Creado, DeTienda, Fecha, Timestamps } from './comunes.js';

export type Medio = 'efectivo' | 'transferencia';

export type CajasTabla = DeTienda &
  Timestamps & {
    fecha: Fecha;
    montoApertura: number;
    abiertaEn: Date;
    cerradaEn: Date | null;
    montoContado: number | null;
    diferencia: number | null;
  };

export type MovimientosCajaTabla = DeTienda &
  Creado & {
    cajaId: number | null;
    tipo: 'ingreso' | 'egreso' | 'deposito';
    medio: Medio;
    monto: number;
    concepto: string;
    origen: 'pedido' | 'fiado' | 'gasto' | 'manual';
    origenId: number | null;
    fecha: Date;
  };

export type ProveedoresTabla = DeTienda &
  Timestamps & { nombre: string; contacto: string | null; activo: Auto<boolean> };

export type GastosTabla = DeTienda &
  Timestamps & {
    proveedorId: number | null;
    tipo: 'gasto' | 'inversion';
    monto: number;
    medio: Medio;
    fecha: Date;
    detalle: string | null;
  };
