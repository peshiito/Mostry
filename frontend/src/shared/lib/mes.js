// Días de un mes para un calendario que arranca el lunes: los null son los
// huecos antes del día 1.
export function diasDelMes(anio, mes) {
  const primero = new Date(anio, mes, 1);
  const cantidad = new Date(anio, mes + 1, 0).getDate();
  const blancos = (primero.getDay() + 6) % 7; // semana que arranca el lunes
  return [
    ...Array.from({ length: blancos }, () => null),
    ...Array.from({ length: cantidad }, (_, i) => new Date(anio, mes, i + 1)),
  ];
}
