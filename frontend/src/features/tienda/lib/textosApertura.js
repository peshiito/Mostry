// Textos del horario y de la próxima apertura (los usa adaptar.js).
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const textoHorario = (tramos) =>
  [1, 2, 3, 4, 5, 6, 0]
    .map(
      (d) =>
        `${DIAS[d]} ${tramos[d] ? tramos[d].map((x) => x.join('–')).join(' y ') : 'cerrado'}`,
    )
    .join(' · ');

// "mañana a las 7:00" / "el 12/10 a las 7:00".
export function proxima(p) {
  if (!p) return 'pronto';
  const manana = new Date(Date.now() + 864e5).toLocaleDateString('sv-SE');
  const hoy = new Date().toLocaleDateString('sv-SE');
  const dia =
    p.fecha === hoy
      ? 'hoy'
      : p.fecha === manana
        ? 'mañana'
        : `el ${p.fecha.slice(8)}/${p.fecha.slice(5, 7)}`;
  return `${dia} a las ${p.hora}`;
}
