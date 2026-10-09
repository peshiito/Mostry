// Texto del estado "abierta". cierraA null: abre las 24 horas (no hay hora de
// cierre que mostrar); 24:00 se lee mejor como "la medianoche".
export function textoAbierta(cierraA) {
  if (cierraA === null || cierraA === undefined) return 'Abierto las 24 horas';
  if (cierraA === '24:00') return 'Abierto · cierra a la medianoche';
  return `Abierto · cierra a las ${cierraA}`;
}
