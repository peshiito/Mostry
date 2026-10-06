import { useConsulta } from '../../../shared/api/useConsulta.js';
import { adaptarCategoria, adaptarProducto } from '../lib/catalogo.js';

// Catálogo público (GET /publico/productos y /publico/categorias).
export function useCatalogo() {
  const prod = useConsulta('/publico/productos');
  const cats = useConsulta('/publico/categorias');
  const productos = (prod.datos?.productos ?? []).map(adaptarProducto);
  return {
    productos,
    destacados: productos.filter((p) => p.destacado),
    categorias: (cats.datos ?? []).map(adaptarCategoria).filter((c) => c.cantidad > 0),
    cargando: prod.cargando || cats.cargando,
    error: prod.error ?? cats.error,
    recargar: () => (prod.recargar(), cats.recargar()),
  };
}

export function useProducto(id) {
  const { datos, cargando, error } = useConsulta(`/publico/productos/${Number(id) || 0}`);
  return { producto: datos ? adaptarProducto(datos) : null, cargando, error };
}
