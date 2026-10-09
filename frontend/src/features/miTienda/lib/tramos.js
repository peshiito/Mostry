// Validación de tramos horarios de un día: abre < cierra y sin superposiciones.
const min = (h) => {
  const [a, b] = h.split(':').map(Number);
  return a * 60 + b;
};

export function errorTramos(tramos) {
  const orden = [...tramos].sort((x, y) => min(x[0]) - min(y[0]));
  for (const [abre, cierra] of orden)
    if (min(abre) >= min(cierra)) return 'Cada tramo tiene que cerrar después de abrir.';
  for (let i = 1; i < orden.length; i++)
    if (min(orden[i][0]) < min(orden[i - 1][1])) return 'Los tramos se superponen.';
  return null;
}

export const NOMBRES_DIAS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// "Las 24 horas" se guarda como un único tramo de 00:00 a 24:00 (sin minuto cerrado).
export const TODO_EL_DIA = ['00:00', '24:00'];
const esTodoElDia = ([abre, cierra]) => abre === '00:00' && cierra === '24:00';

// Cómo se ve un día en la pantalla: cerrado, con horario o abierto las 24 horas.
export function modoDelDia(tramos) {
  if (tramos.length === 0) return 'cerrado';
  return tramos.length === 1 && esTodoElDia(tramos[0]) ? '24h' : 'horario';
}

// Tramos con los que arranca cada modo al elegirlo.
export const TRAMOS_DEL_MODO = {
  cerrado: [],
  horario: [['08:00', '13:00']],
  '24h': [TODO_EL_DIA],
};
