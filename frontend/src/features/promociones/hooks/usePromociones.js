import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

const dia = (iso) => new Date(iso).toLocaleDateString('sv-SE');
const hoy = () => new Date().toLocaleDateString('sv-SE');

// Promociones (/panel/promociones) con estado calculado: vigente, programada o vencida.
export function usePromociones() {
  const { datos, cargando, recargar } = useConsulta('/panel/promociones');
  // El segundo argumento de ejecutar() es el texto del aviso (sin texto, no avisa).
  const accion = useAccion(
    async (fn) => {
      await fn();
      recargar();
    },
    { exito: (_, _fn, texto) => texto },
  );
  const promos = (datos ?? []).map((p) => ({
    ...p,
    desde: dia(p.desde),
    hasta: dia(p.hasta),
    vencida: dia(p.hasta) < hoy(),
    programada: dia(p.desde) > hoy(),
  }));
  const alternar = (id) => {
    const p = promos.find((x) => x.id === id);
    accion.ejecutar(
      () => panel.patch(`/promociones/${id}`, { activa: !p.activa }),
      p.activa ? 'Promoción pausada' : 'Promoción activada',
    );
  };
  // Fechas del formulario (día) → instantes con la zona de Argentina.
  const agregar = (p) =>
    accion.ejecutar(
      () =>
        panel.post('/promociones', {
          titulo: p.titulo.trim(),
          descripcion: p.descripcion.trim() || null,
          desde: `${p.desde}T00:00:00-03:00`,
          hasta: `${p.hasta}T23:59:00-03:00`,
          activa: true,
        }),
      'Promoción creada',
    );
  return { promos, cargando, alternar, agregar, error: accion.error };
}
