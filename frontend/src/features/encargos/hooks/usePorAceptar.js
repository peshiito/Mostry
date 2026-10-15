import { useConsulta } from '../../../shared/api/useConsulta.js';

// Encargos 2: los encargos que esperan que la tienda los acepte (todas las fechas).
export function usePorAceptar() {
  const { datos, error } = useConsulta(
    '/panel/pedidos?estado=pendiente_confirmacion&tipo=encargo',
  );
  return { encargos: datos?.pedidos ?? [], total: datos?.total ?? 0, error };
}
