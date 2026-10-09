// Traduce GET /publico/tienda al formato que usan las pantallas.
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function tramosPorDia(horarios) {
  const t = {};
  for (const h of horarios) (t[h.diaSemana] ??= []).push([h.abre, h.cierra]);
  return t;
}

const textoHorario = (tramos) =>
  [1, 2, 3, 4, 5, 6, 0]
    .map(
      (d) =>
        `${DIAS[d]} ${tramos[d] ? tramos[d].map((x) => x.join('–')).join(' y ') : 'cerrado'}`,
    )
    .join(' · ');

// "mañana a las 7:00" / "el 12/10 a las 7:00".
function proxima(p) {
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

export function adaptarTienda(t, slug) {
  // Suspendida: la API manda solo lo mínimo para "Cerrada temporalmente".
  if (!t.disponible) {
    const { nombre, frase, logoUrl, paleta } = t;
    return { estado: 'suspendida', tienda: { slug, nombre, frase, logoUrl, paleta } };
  }
  const tramos = tramosPorDia(t.horarios);
  const a = t.apertura;
  const estado = a.abierta ? 'abierta' : a.motivo === 'pausada' ? 'pausada' : 'cerrada';
  const promo = t.promociones[0];
  return {
    estado,
    tienda: {
      slug,
      nombre: t.nombre,
      frase: t.frase,
      logoUrl: t.logoUrl,
      paleta: t.paleta,
      whatsapp: t.whatsapp,
      direccion: t.direccion,
      cierraA: a.cierraA,
      abreProximo: proxima(a.proximaApertura),
      horarioTexto: textoHorario(tramos),
      tramos,
      feriados: [],
      aceptaEnvio: t.entrega.envio,
      aceptaRetiro: t.entrega.retiro,
      costoEnvio: t.entrega.costoEnvio,
      zonaEnvio: t.entrega.zonaEnvio ?? '',
      anticipacionEncargoHoras: t.encargos.anticipacionHoras,
      senaPorcentaje: t.encargos.senaPorcentaje,
      promo: promo ? { titulo: promo.titulo, descripcion: promo.descripcion } : null,
    },
  };
}
