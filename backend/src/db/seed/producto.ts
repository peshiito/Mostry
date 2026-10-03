import type { ProductoSeed } from './tipos.js';

// Atajo para el seed: precio en centavos (35000 = $350).
export function producto(
  nombre: string,
  precio: number,
  stock: number,
  extra: Partial<ProductoSeed> = {},
): ProductoSeed {
  return { nombre, precio, stock, descripcion: null, ...extra };
}
