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
  destacado: boolean;
  categoriaId: number | null;
};
type FilaFoto = { id: number; productoId: number; clave: string; orden: number };

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
    disponible: !p.agotado && p.stock - p.stockReservado > 0,
    aceptaEncargo: p.aceptaEncargo,
    fotos: propias,
  };
}

// En los listados alcanza con la foto principal.
export const conFotoPrincipal = (p: ReturnType<typeof presentarProductoPublico>) => {
  const { fotos, ...resto } = p;
  return { ...resto, foto: fotos[0] ?? null };
};
