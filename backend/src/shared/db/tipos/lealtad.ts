import type { ColumnType } from 'kysely';
import type { Auto, ColTienda, Creado } from './comunes.js';

// Programa de lealtad de cada tienda (0045). Uno por tienda.
export type ProgramasLealtadTabla = {
  tiendaId: ColTienda;
  nombre: string;
  compraMinima: Auto<number>; // centavos; 0 = sin mínimo
  venceMeses: number | null; // null = los sellos no vencen
  actualizadoEn: ColumnType<Date, never, never>;
};

export type TipoPremio = 'porcentaje' | 'monto' | 'regalo';

export type PremiosLealtadTabla = {
  id: Auto<number>;
  tiendaId: ColTienda;
  compras: number; // en qué sello se habilita
  tipo: TipoPremio;
  valor: number | null; // porcentaje 1–100 o centavos; null en regalo
  tope: number | null; // centavos, solo en porcentaje
  descripcion: string | null;
};

// Sellos (0046): uno por compra que llegó al mínimo, en esa tienda.
export type SellosTabla = Creado & {
  id: Auto<number>;
  tiendaId: ColTienda;
  clienteId: number;
  origen: 'pedido' | 'venta';
  origenId: number;
  monto: number;
};

// Premios usados (0047): el premio copiado como estaba ese día.
export type CanjesTabla = Creado & {
  id: Auto<number>;
  tiendaId: ColTienda;
  clienteId: number;
  compras: number;
  tipo: TipoPremio;
  valor: number | null;
  tope: number | null;
  descripcion: string | null;
  hastaSelloId: number; // los sellos hasta este id quedaron gastados
  descuento: number;
  origen: 'pedido' | 'venta';
  origenId: number;
  anuladoEn: Date | null;
};
