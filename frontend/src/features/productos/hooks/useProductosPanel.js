import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

// Productos del panel, incluidos los inactivos (GET /panel/productos?estado=todos).
export function useProductosPanel() {
  const prod = useConsulta('/panel/productos?estado=todos');
  const cats = useConsulta('/panel/categorias');
  const productos = (prod.datos?.productos ?? []).map((p) => ({
    ...p,
    stock: p.stockDisponible,
    foto: '/sin-foto.svg',
  }));
  async function alternar(id, campo) {
    const p = productos.find((x) => x.id === id);
    await panel.patch(`/productos/${id}`, { [campo]: !p[campo] }).catch(() => {});
    prod.recargar();
  }
  return {
    productos,
    categorias: cats.datos ?? [],
    alternar,
    cargando: prod.cargando || cats.cargando,
    error: prod.error,
  };
}
