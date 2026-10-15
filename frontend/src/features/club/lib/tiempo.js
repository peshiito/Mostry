// 192 → "3:12"
export const minutosYSegundos = (s) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
