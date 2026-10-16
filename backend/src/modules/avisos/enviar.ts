import type { TiendaId } from '../../shared/db/tiendaId.js';
import { logger } from '../../shared/logger.js';
import { pedidosRepo } from '../pedidos/repositorios/pedidos.repository.js';
import { colaRepo, type Filtro } from './cola.repository.js';
import { mandarATienda } from './mandar.js';
import { textoResumen } from './resumen/textoResumen.js';
import { textoAviso } from './textos.js';

type Aviso = Awaited<ReturnType<typeof colaRepo.pendientes>>[number];

// El texto se arma al mandar, con los datos de ahora (la cola no los guarda).
async function textoDe(a: Aviso, tiendaId: TiendaId, ahora: Date) {
  if (a.tipo === 'resumen') return textoResumen(tiendaId, ahora);
  if (!a.pedidoId) return null;
  const p = await pedidosRepo.buscar(tiendaId, a.pedidoId);
  return p ? textoAviso(a.tipo, p) : null;
}

// Reclama, arma y manda los avisos pendientes. Lo llaman la API (al toque,
// después de confirmar) y el worker (red de seguridad). Nunca manda dos veces.
export async function enviarAvisos(f: Partial<Filtro> = {}) {
  const ahora = f.ahora ?? new Date();
  const avisos = await colaRepo.pendientes({ ...f, ahora });
  let enviados = 0;
  for (const a of avisos) {
    if (!(await colaRepo.reclamar(a.id, ahora))) continue;
    try {
      const texto = await textoDe(a, a.tiendaId, ahora);
      if (texto) await mandarATienda(a.tiendaId, texto, ahora);
      await colaRepo.marcarEnviado(a.id, ahora);
      enviados++;
    } catch (err) {
      // Queda reclamado: se reintenta a los 5 minutos (hasta 5 intentos).
      logger.warn({ err, avisoId: a.id }, 'No se pudo mandar un aviso push');
    }
  }
  return { revisados: avisos.length, enviados };
}
