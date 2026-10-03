import type { EstadoTienda } from '../../../shared/db/tipos/tiendas.js';

const DIA_MS = 24 * 60 * 60 * 1000;
export const DIAS_GRACIA = 3;
const DIAS_AVISO = 3;

export type FechasSuscripcion = {
  estado: EstadoTienda;
  pruebaHasta: Date | null;
  planHasta: Date | null;
  suspendidaManual: boolean;
};

const vencimiento = (t: FechasSuscripcion): Date | null => {
  const fechas = [t.pruebaHasta, t.planHasta].filter((f): f is Date => f !== null);
  return fechas.length ? new Date(Math.max(...fechas.map((f) => f.getTime()))) : null;
};

// Estado real según las fechas, sin esperar al worker (sección 6.5).
// La suspensión manual del admin pisa todo. Si no:
// vigente → activa/prueba · vencida hace < 3 días → gracia · después → suspendida.
export function estadoEfectivo(t: FechasSuscripcion, ahora = new Date()): EstadoTienda {
  if (t.suspendidaManual) return 'suspendida';
  const vence = vencimiento(t);
  if (!vence) return t.estado; // prueba que todavía no arrancó (email sin verificar)
  if (ahora < vence) return t.planHasta && ahora < t.planHasta ? 'activa' : 'prueba';
  return ahora.getTime() < vence.getTime() + DIAS_GRACIA * DIA_MS
    ? 'gracia'
    : 'suspendida';
}

// Lo que necesita el banner del panel.
export function resumenSuscripcion(t: FechasSuscripcion, ahora = new Date()) {
  const estado = estadoEfectivo(t, ahora);
  const vence = vencimiento(t);
  const diasRestantes = vence
    ? Math.max(0, Math.ceil((vence.getTime() - ahora.getTime()) / DIA_MS))
    : null;
  const finGracia = vence ? new Date(vence.getTime() + DIAS_GRACIA * DIA_MS) : null;
  const porVencer = diasRestantes !== null && diasRestantes <= DIAS_AVISO;
  const mostrarAviso = estado === 'gracia' || estado === 'suspendida' || porVencer;
  return { estado, venceEl: vence, finGracia, diasRestantes, mostrarAviso };
}
