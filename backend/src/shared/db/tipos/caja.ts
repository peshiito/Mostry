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
    origen: 'pedido' | 'fiado' | 'gasto' | 'manual' | 'venta';
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

// Venta rápida en el local (0042). Los ítems sin producto son "montos sueltos".
export type VentasTabla = DeTienda & {
  numero: number;
  total: number;
  medio: Medio;
  creadaEn: Auto<Date>;
  clienteId: number | null; // cliente del Club (0046)
  descuento: Auto<number>; // premio del Club usado (0047)
};

export type VentaItemsTabla = DeTienda & {
  ventaId: number;
  productoId: number | null;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
};
