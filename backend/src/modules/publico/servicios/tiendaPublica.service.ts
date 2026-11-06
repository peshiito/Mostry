import { urlPublica } from '../../../shared/archivos/almacenamiento.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { programaPublico } from '../../club/programa/programa.service.js';
import { cargarAgenda } from '../../horarios/repositorios/agenda.repository.js';
import { estadoApertura } from '../../horarios/servicios/apertura.js';
import { paginaConMedios } from '../../tiendas/pagina/paginaPublicada.js';
import { fotosGaleria } from '../../tiendas/vidriera/galeriaLectura.js';
import { tiendaPublicaRepo } from '../repositorios/tiendaPublica.repository.js';
import { disponibilidad } from './disponibilidad.js';

// Pantalla de inicio de la tienda: datos, abierto/cerrado, horarios y promociones.
export async function verTiendaPublica(tiendaId: TiendaId) {
  const ahora = new Date();
  const t = await tiendaPublicaRepo.buscar(tiendaId);
  const estado = disponibilidad(t, ahora);
  if (estado === 'sin_publicar')
    throw new AppError(404, 'tienda_no_encontrada', 'No encontramos esta tienda.');
  const datos = {
    nombre: t.nombre,
    frase: t.frase,
    logoUrl: t.logoClave ? urlPublica(t.logoClave) : null,
    paleta: t.paleta,
    tema: t.tema,
  };
  // Suspendida: solo lo mínimo para mostrar "Cerrada temporalmente".
  if (estado === 'suspendida') return { ...datos, disponible: false as const };

  const agenda = await cargarAgenda(tiendaId, ahora);
  return {
    ...datos,
    disponible: true as const,
    // Sin venta online, el frontend muestra la tarjeta de presentación.
    vendeOnline: t.vendeOnline,
    whatsapp: t.whatsapp,
    direccion: t.direccion,
    entrega: {
      envio: t.aceptaEnvio,
      retiro: t.aceptaRetiro,
      costoEnvio: t.costoEnvio,
      zonaEnvio: t.zonaEnvio,
    },
    encargos: {
      senaPorcentaje: t.senaPorcentaje,
      anticipacionHoras: t.anticipacionEncargoHoras,
    },
    apertura: estadoApertura(agenda, ahora),
    horarios: agenda.tramos,
    promociones: await tiendaPublicaRepo.promocionesVigentes(tiendaId, ahora),
    // El club sirve también en el local: va aunque no venda online.
    club: await programaPublico(tiendaId, t.usaClub),
    // Vidriera 2.0 (V3 y V4): portada, contenido y fotos del local.
    portadaUrl: t.portadaClave ? urlPublica(t.portadaClave) : null,
    contenido: t.contenido,
    galeria: await fotosGaleria(tiendaId),
    // "Armá tu página": la página publicada (null = la de siempre) y sus imágenes.
    ...(await paginaConMedios(tiendaId)),
  };
}
