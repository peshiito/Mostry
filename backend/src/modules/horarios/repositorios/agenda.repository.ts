import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { tiendaConfigRepo } from '../../tiendas/tiendaConfig.repository.js';
import type { Agenda } from '../servicios/apertura.js';
import { MAX_DIAS_ENCARGO } from '../servicios/fechaEncargo.js';
import { feriadosRepo } from './feriados.repository.js';
import { horariosRepo } from './horarios.repository.js';

const DIA_MS = 24 * 60 * 60 * 1000;

// Todo lo que hace falta para saber si la tienda atiende: tramos, feriados
// próximos (alcanza para validar encargos) y si está pausada.
export async function cargarAgenda(
  tiendaId: TiendaId,
  ahora = new Date(),
): Promise<Agenda> {
  const desde = enArgentina(ahora).fecha;
  const hasta = enArgentina(
    new Date(ahora.getTime() + (MAX_DIAS_ENCARGO + 1) * DIA_MS),
  ).fecha;
  const [tramos, feriados, config] = await Promise.all([
    horariosRepo.listar(tiendaId),
    feriadosRepo.listar(tiendaId, desde, hasta),
    tiendaConfigRepo.buscar(tiendaId),
  ]);
  return {
    tramos,
    feriados: new Set(feriados.map((f) => f.fecha)),
    pausada: config.pausada,
  };
}
