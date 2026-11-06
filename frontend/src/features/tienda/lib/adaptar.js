// Traduce GET /publico/tienda al formato que usan las pantallas.
import { proxima, textoHorario } from './textosApertura.js';

export function tramosPorDia(horarios) {
  const t = {};
  for (const h of horarios) (t[h.diaSemana] ??= []).push([h.abre, h.cierra]);
  return t;
}

export function adaptarTienda(t, slug) {
  // Suspendida: la API manda solo lo mínimo para "Cerrada temporalmente".
  if (!t.disponible) {
    const { nombre, frase, logoUrl, paleta, tema = null } = t;
    return {
      estado: 'suspendida',
      tienda: { slug, nombre, frase, logoUrl, paleta, tema },
    };
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
      tema: t.tema ?? null,
      portadaUrl: t.portadaUrl ?? null,
      contenido: t.contenido ?? null,
      galeria: t.galeria ?? [],
      pagina: t.pagina ?? null,
      medios: t.medios ?? [], // las imágenes que usa la página // "Armá tu página": la publicada, si armó una
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
      // Sin venta online, la tienda muestra solo su tarjeta de presentación.
      vendeOnline: t.vendeOnline !== false,
      club: t.club ?? null, // Lealtad: el programa, si está prendido
    },
  };
}
