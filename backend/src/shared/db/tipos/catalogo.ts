import type { Auto, Creado, Fecha, Hora, Timestamps } from './comunes.js';

type DeTienda = { id: Auto<number>; tiendaId: number };

export type CategoriasTabla = DeTienda &
  Timestamps & { nombre: string; orden: Auto<number>; activa: Auto<boolean> };

export type ProductosTabla = DeTienda &
  Timestamps & {
    categoriaId: number | null;
    nombre: string;
    descripcion: string | null;
    precio: number;
    stock: Auto<number>;
    stockReservado: Auto<number>;
    stockMinimo: Auto<number>;
    agotado: Auto<boolean>;
    destacado: Auto<boolean>;
    activo: Auto<boolean>;
    aceptaEncargo: Auto<boolean>;
  };

export type ProductoFotosTabla = DeTienda &
  Creado & { productoId: number; clave: string; orden: Auto<number> };

export type HorariosTabla = DeTienda &
  Timestamps & { diaSemana: number; abre: Hora; cierra: Hora };

export type FeriadosTabla = DeTienda & Creado & { fecha: Fecha; motivo: string | null };

export type PromocionesTabla = DeTienda &
  Timestamps & {
    titulo: string;
    descripcion: string | null;
    desde: Date;
    hasta: Date;
    activa: Auto<boolean>;
  };
