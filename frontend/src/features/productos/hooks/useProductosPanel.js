import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';

// Productos del panel, incluidos los inactivos (GET /productos?estado=todos).
export function useProductosPanel() {
  const panel = usePanelApi();
  const base = useBasePanel();
  const prod = useConsulta(`${base.api}/productos?estado=todos`);
  const cats = useConsulta(`${base.api}/categorias`);
  const productos = (prod.datos?.productos ?? []).map((p) => ({
    ...p,
    stock: p.stockDisponible,
    foto: '/sin-foto.svg',
  }));
  // Si falla (tienda suspendida, sin conexión) se avisa; siempre se resincroniza.
  const cambio = useAccion(async (id, campo, valor) => {
    try {
      await panel.patch(`/productos/${id}`, { [campo]: valor });
    } finally {
      prod.recargar();
    }
  });
  const alternar = (id, campo) => {
    const p = productos.find((x) => x.id === id);
    return cambio.ejecutar(id, campo, !p[campo]);
  };
  return {
    productos,
    categorias: cats.datos ?? [],
    alternar,
    cargando: prod.cargando || cats.cargando,
    error: prod.error ?? cats.error,
    recargar: () => (prod.recargar(), cats.recargar()),
    errorCambio: cambio.error,
  };
}
