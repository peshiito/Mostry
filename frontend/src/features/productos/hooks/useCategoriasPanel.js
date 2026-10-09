import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';

// Categorías: alta, orden (se mandan todos los ids) y baja (/categorias).
export function useCategoriasPanel() {
  const panel = usePanelApi();
  const base = useBasePanel();
  const { datos, cargando, recargar, setDatos } = useConsulta(`${base.api}/categorias`);
  const cats = (datos ?? []).map((c) => ({ ...c, cantidad: c.productosActivos }));
  // El segundo argumento de ejecutar() es el texto del aviso (sin texto, no avisa).
  const accion = useAccion(
    // Si falla (por ejemplo, el nuevo orden), se vuelve a lo que dice la base.
    async (fn) => {
      try {
        await fn();
      } finally {
        recargar();
      }
    },
    { exito: (_, _fn, texto) => texto },
  );
  const mover = (i, d) => {
    const n = [...cats];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    setDatos(n);
    accion.ejecutar(() => panel.put('/categorias/orden', { ids: n.map((c) => c.id) }));
  };
  const quitar = (id) =>
    accion.ejecutar(() => panel.borrar(`/categorias/${id}`), 'Categoría eliminada');
  const agregar = async (nombre) =>
    (
      await accion.ejecutar(
        () => panel.post('/categorias', { nombre }),
        'Categoría creada',
      )
    ).ok;
  return { cats, cargando, mover, quitar, agregar, error: accion.error };
}
