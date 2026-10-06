import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

// Fotos de un producto: la API las valida y las pasa a WebP (sección 7).
export function useFotos(productoId) {
  const ruta = productoId ? `/productos/${productoId}/fotos` : null;
  const { datos, recargar } = useConsulta(ruta ? `/panel${ruta}` : null);
  const subir = useAccion((archivo) => panel.subir(ruta, 'foto', archivo), {
    exito: 'Foto agregada',
  });
  const borrar = useAccion((fotoId) => panel.borrar(`${ruta}/${fotoId}`), {
    exito: 'Foto eliminada',
  });
  return {
    fotos: datos ?? [],
    agregar: async (archivo) => (await subir.ejecutar(archivo)).ok && recargar(),
    quitar: async (fotoId) => (await borrar.ejecutar(fotoId)).ok && recargar(),
    error: subir.error ?? borrar.error,
    subiendo: subir.enviando,
  };
}
