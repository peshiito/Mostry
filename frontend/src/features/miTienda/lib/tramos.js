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
