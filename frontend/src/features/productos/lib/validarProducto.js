import { aCentavos } from '../../../shared/lib/plata.js';

// Validación del formulario de producto (el servidor valida igual con Zod).
export function validarProducto(f) {
  const e = {};
  if (f.nombre.trim().length < 2) e.nombre = 'Poné un nombre.';
  if (f.descripcion.length > 240) e.descripcion = 'Hasta 240 caracteres.';
  const precio = aCentavos(f.precio);
  if (precio === null || precio <= 0) e.precio = 'Escribí un precio mayor a cero.';
  if (!Number.isInteger(Number(f.stock)) || Number(f.stock) < 0)
    e.stock = 'Tiene que ser 0 o más.';
  return e;
}
