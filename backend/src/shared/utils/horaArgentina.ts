// La lógica de horarios usa SIEMPRE la hora de Argentina (CLAUDE.md 5),
// aunque el servidor y la base trabajen en UTC.
export const ZONA_AR = 'America/Argentina/Buenos_Aires';

const formato = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA_AR,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type MomentoLocal = { fecha: string; diaSemana: DiaSemana; minutos: number };

// Un instante UTC visto en Argentina: fecha 'YYYY-MM-DD', día (0 = domingo) y
// minuto del día. El día de la semana sale de la fecha, no del texto de Intl.
export function enArgentina(instante: Date): MomentoLocal {
  const p = Object.fromEntries(
    formato.formatToParts(instante).map((x) => [x.type, x.value]),
  );
  const [anio, mes, dia, hora, minuto] = [p.year, p.month, p.day, p.hour, p.minute].map(
    Number,
  );
  if (![anio, mes, dia, hora, minuto].every(Number.isInteger)) {
    throw new Error(`No se pudo leer la hora argentina de ${instante.toISOString()}`);
  }
  return {
    fecha: `${p.year}-${p.month}-${p.day}`,
    diaSemana: new Date(Date.UTC(anio!, mes! - 1, dia!)).getUTCDay() as DiaSemana,
    minutos: hora! * 60 + minuto!,
  };
}

// 'HH:MM' o 'HH:MM:SS' → minutos desde la medianoche ('24:00' = 1440).
export const aMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h! * 60 + m!;
};

export const aHora = (minutos: number) =>
  `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;

// Inicio de un día argentino ('YYYY-MM-DD') como instante UTC. Argentina es
// UTC−3 todo el año (sin horario de verano desde 2009).
export const inicioDiaAr = (fecha: string) => new Date(`${fecha}T00:00:00-03:00`);
