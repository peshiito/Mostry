import type { Insertable } from 'kysely';
import type { ProductosTabla } from '../../shared/db/tipos/catalogo.js';
import type { TiendasTabla } from '../../shared/db/tipos/tiendas.js';

export type ProductoSeed = Omit<Insertable<ProductosTabla>, 'tiendaId' | 'categoriaId'>;

export type DatosSeed = {
  tienda: Insertable<TiendasTabla>;
  duenio: { email: string; nombre: string };
  categorias: { nombre: string; productos: ProductoSeed[] }[];
  // dias: 0 = domingo … 6 = sábado
  horarios: { dias: number[]; abre: string; cierra: string }[];
  promocion: { titulo: string; descripcion: string; dias: number };
  feriado: { fecha: string; motivo: string };
};
