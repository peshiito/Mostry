import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

// Notas sueltas del negocio (se pueden borrar).
export function useNotas() {
  const {
    datos,
    cargando,
    error: errorCarga,
    recargar,
  } = useConsulta('/panel/libreta/notas');
  // El segundo argumento de ejecutar() es el texto del aviso (sin texto, no avisa).
  const accion = useAccion(
    async (fn) => {
      await fn();
      recargar();
    },
    { exito: (_, _fn, texto) => texto },
  );
  return {
    notas: datos ?? [],
    cargando,
    errorCarga,
    recargar,
    agregar: (texto) =>
      accion.ejecutar(() => panel.post('/libreta/notas', { texto }), 'Nota guardada'),
    borrar: (id) =>
      accion.ejecutar(() => panel.borrar(`/libreta/notas/${id}`), 'Nota borrada'),
    error: accion.error,
  };
}
