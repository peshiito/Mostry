import type { Auto, Creado, DeTienda, Timestamps } from './comunes.js';

export type ClientesLibretaTabla = DeTienda &
  Timestamps & { nombre: string; telefono: string | null; activo: Auto<boolean> };

export type MovimientosFiadoTabla = DeTienda &
  Creado & {
    clienteId: number;
    tipo: 'deuda' | 'pago';
    monto: number;
    detalle: string | null;
    fecha: Date;
  };

export type NotasTabla = DeTienda & Timestamps & { texto: string; fecha: Date };
