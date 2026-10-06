import {
  estadoEfectivo,
  type FechasSuscripcion,
} from '../../tiendas/servicios/estadoSuscripcion.js';

export type Disponibilidad = 'disponible' | 'suspendida' | 'sin_publicar';

// ¿La tienda se muestra al público? (sección 6.5)
// - Sin prueba ni plan: el dueño todavía no verificó el email → no se publica.
// - Suspendida: se muestra "Cerrada temporalmente", sin catálogo ni compras.
export function disponibilidad(t: FechasSuscripcion, ahora = new Date()): Disponibilidad {
  if (!t.pruebaHasta && !t.planHasta && !t.suspendidaManual) return 'sin_publicar';
  return estadoEfectivo(t, ahora) === 'suspendida' ? 'suspendida' : 'disponible';
}
