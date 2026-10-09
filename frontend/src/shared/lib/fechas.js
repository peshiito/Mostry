// Fechas en hora argentina para mostrar (la base guarda UTC, sección 5).
const ZONA = 'America/Argentina/Buenos_Aires';

export const fechaHora = (iso) =>
  new Date(iso).toLocaleString('es-AR', {
    timeZone: ZONA,
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

export const fechaCorta = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', {
    timeZone: ZONA,
    day: '2-digit',
    month: '2-digit',
  });

export const hora = (iso) =>
  new Date(iso).toLocaleTimeString('es-AR', {
    timeZone: ZONA,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

// "hace 12 min", "hace 2 h", "ayer".
export function haceCuanto(iso, ahora = Date.now()) {
  const min = Math.round((ahora - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `hace ${h} h` : h < 48 ? 'ayer' : fechaCorta(iso);
}

// "martes, 6 de octubre" (para títulos de pantalla).
export const hoyLargo = () =>
  new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
