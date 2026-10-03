import type { Auto, Creado, Timestamps } from './comunes.js';

type DeTienda = { id: Auto<number>; tiendaId: number };

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
