// Calendario de encargos: días del mes, disponibilidad y turnos de 30 minutos.
// Las horas se piensan en hora argentina; el servidor vuelve a validar todo.
const MS_HORA = 3600 * 1000;

export function diasDelMes(anio, mes) {
  const primero = new Date(anio, mes, 1);
  const cantidad = new Date(anio, mes + 1, 0).getDate();
  const blancos = (primero.getDay() + 6) % 7; // semana que arranca el lunes
  return [
    ...Array.from({ length: blancos }, () => null),
    ...Array.from({ length: cantidad }, (_, i) => new Date(anio, mes, i + 1)),
  ];
}

// tramos: { [diaSemana 0-6]: [['07:00','13:00'], ...] } · feriados: ['2026-10-12']
export function turnosDelDia(
  fecha,
  tramos,
  feriados,
  anticipacionHoras,
  ahora = new Date(),
) {
  const iso = fecha.toLocaleDateString('sv-SE');
  if (feriados.includes(iso)) return [];
  const limite = ahora.getTime() + anticipacionHoras * MS_HORA;
  const turnos = [];
  for (const [abre, cierra] of tramos[fecha.getDay()] ?? []) {
    const [ha, ma] = abre.split(':').map(Number);
    const [hc, mc] = cierra.split(':').map(Number);
    for (let m = ha * 60 + ma; m + 30 <= hc * 60 + mc; m += 30) {
      const t = new Date(fecha);
      t.setHours(Math.floor(m / 60), m % 60, 0, 0);
      if (t.getTime() >= limite) turnos.push(t);
    }
  }
  return turnos;
}

export const horaTexto = (t) =>
  t.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
