import { aCentavos } from '../../../shared/lib/plata.js';

export const FORM_NUEVO = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoriaId: '',
  modoStock: 'unidades',
  stock: '0',
  stockMinimo: '0',
  aceptaEncargo: false,
  pidePersonalizacion: false,
  indicacionPersonalizacion: '',
  anticipacionHoras: '',
  destacado: false,
  activo: true,
};

// Producto de la API → valores del formulario (precio en pesos, números como texto).
export const aFormulario = (p) => ({
  nombre: p.nombre,
  descripcion: p.descripcion ?? '',
  precio: String(p.precio / 100),
  categoriaId: p.categoriaId ? String(p.categoriaId) : '',
  modoStock: p.modoStock,
  stock: String(p.stock),
  stockMinimo: String(p.stockMinimo),
  aceptaEncargo: p.aceptaEncargo,
  pidePersonalizacion: p.pidePersonalizacion,
  indicacionPersonalizacion: p.indicacionPersonalizacion ?? '',
  anticipacionHoras: p.anticipacionHoras == null ? '' : String(p.anticipacionHoras),
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
    modoStock: f.modoStock,
    aceptaEncargo: f.modoStock === 'a_pedido' || f.aceptaEncargo,
    // Encargos 2: lo que se personaliza solo se encarga.
    pidePersonalizacion:
      (f.modoStock === 'a_pedido' || f.aceptaEncargo) && f.pidePersonalizacion,
    indicacionPersonalizacion: f.indicacionPersonalizacion.trim() || null,
    // Encargos 3: vacío = la anticipación de la tienda.
    anticipacionHoras:
      f.anticipacionHoras === '' ? null : Math.round(Number(f.anticipacionHoras)),
    destacado: f.destacado,
    activo: f.activo,
  };
  // Las cantidades solo viajan si el producto cuenta unidades.
  if (f.modoStock !== 'unidades') return cuerpo;
  cuerpo.stockMinimo = Number(f.stockMinimo);
  if (!original) return { ...cuerpo, stock: Number(f.stock) };
  if (Number(f.stock) !== original.stock)
    Object.assign(cuerpo, { stock: Number(f.stock), stockAnterior: original.stock });
  return cuerpo;
}
