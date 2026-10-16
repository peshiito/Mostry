import { enArgentina } from '../../shared/utils/horaArgentina.js';

const minutos = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));

// ¿Está en su horario de silencio (hora argentina)? Puede cruzar la medianoche
// (23 a 7). "hasta" no se incluye: a las 7 en punto ya vuelve a sonar.
export function enSilencio(desde: string | null, hasta: string | null, ahora: Date) {
  if (!desde || !hasta) return false;
  const m = enArgentina(ahora).minutos;
  const [a, b] = [minutos(desde), minutos(hasta)];
  return a < b ? m >= a && m < b : m >= a || m < b;
}
