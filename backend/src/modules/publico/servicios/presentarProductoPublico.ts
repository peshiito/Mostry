import type { ModoStock } from '../../../shared/db/tipos/catalogo.js';
import { presentarFoto } from '../../catalogo/servicios/urlsFoto.js';

type FilaProducto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  stockReservado: number;
  agotado: boolean;
  aceptaEncargo: boolean;
  pidePersonalizacion: boolean;
  indicacionPersonalizacion: string | null;
  anticipacionHoras: number | null;
  modoStock: ModoStock;
  destacado: boolean;
  categoriaId: number | null;
};
type FilaFoto = { id: number; productoId: number; clave: string; orden: number };

// Se puede comprar al toque: por unidades, si queda; "hay / no hay", si está en
// "hay"; lo que se hace a pedido, nunca (solo se encarga).
const disponibleAhora = (p: FilaProducto) =>
  !p.agotado &&
  (p.modoStock === 'simple' ||
    (p.modoStock === 'unidades' && p.stock - p.stockReservado > 0));

// Lo que ve el comprador: disponible sí/no, nunca el stock exacto.
export function presentarProductoPublico(p: FilaProducto, fotos: FilaFoto[]) {
  const propias = fotos.filter((f) => f.productoId === p.id).map(presentarFoto);
  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    categoriaId: p.categoriaId,
    destacado: p.destacado,
    disponible: disponibleAhora(p),
    aceptaEncargo: p.aceptaEncargo,
    soloEncargo: p.modoStock === 'a_pedido',
    pidePersonalizacion: p.pidePersonalizacion,
    indicacionPersonalizacion: p.indicacionPersonalizacion,
    anticipacionHoras: p.anticipacionHoras, // null: la de la tienda
    fotos: propias,
  };
}

// En los listados alcanza con la foto principal.
export const conFotoPrincipal = (p: ReturnType<typeof presentarProductoPublico>) => {
  const { fotos, ...resto } = p;
  return { ...resto, foto: fotos[0] ?? null };
};
