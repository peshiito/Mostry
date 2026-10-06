import { aCentavos } from '../../../shared/lib/plata.js';

export const FORM_NUEVO = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoriaId: '',
  stock: '0',
  stockMinimo: '0',
  aceptaEncargo: false,
  destacado: false,
  activo: true,
};

// Producto de la API → valores del formulario (precio en pesos, números como texto).
export const aFormulario = (p) => ({
  nombre: p.nombre,
  descripcion: p.descripcion ?? '',
  precio: String(p.precio / 100),
  categoriaId: p.categoriaId ? String(p.categoriaId) : '',
  stock: String(p.stock),
  stockMinimo: String(p.stockMinimo),
  aceptaEncargo: p.aceptaEncargo,
  destacado: p.destacado,
  activo: p.activo,
});

// Formulario → cuerpo para la API. Si cambia el stock, va el que se vio (stockAnterior).
export function aCuerpo(f, original) {
  const cuerpo = {
    nombre: f.nombre.trim(),
    descripcion: f.descripcion.trim() || null,
    precio: aCentavos(f.precio),
    categoriaId: f.categoriaId ? Number(f.categoriaId) : null,
    stockMinimo: Number(f.stockMinimo),
    aceptaEncargo: f.aceptaEncargo,
    destacado: f.destacado,
    activo: f.activo,
  };
  if (!original) return { ...cuerpo, stock: Number(f.stock) };
  if (Number(f.stock) !== original.stock)
    Object.assign(cuerpo, { stock: Number(f.stock), stockAnterior: original.stock });
  return cuerpo;
}
