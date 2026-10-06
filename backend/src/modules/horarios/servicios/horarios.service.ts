import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { esDuplicado } from '../../../shared/db/esDuplicado.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { cargarAgenda } from '../repositorios/agenda.repository.js';
import { feriadosRepo } from '../repositorios/feriados.repository.js';
import { horariosRepo } from '../repositorios/horarios.repository.js';
import { estadoApertura, type Tramo } from './apertura.js';

const hoy = () => enArgentina(new Date()).fecha;

export const verHorarios = (tiendaId: TiendaId) => horariosRepo.listar(tiendaId);

export async function guardarHorarios(tiendaId: TiendaId, tramos: Tramo[]) {
  await horariosRepo.reemplazar(tiendaId, tramos);
  return horariosRepo.listar(tiendaId);
}

export const listarFeriados = (tiendaId: TiendaId) =>
  feriadosRepo.listar(tiendaId, hoy());

export async function agregarFeriado(tiendaId: TiendaId, fecha: string, motivo?: string) {
  if (fecha < hoy())
    throw new AppError(
      400,
      'fecha_pasada',
      'El feriado tiene que ser hoy o más adelante.',
    );
  try {
    return {
      id: await feriadosRepo.crear(tiendaId, fecha, motivo || null),
      fecha,
      motivo: motivo || null,
    };
  } catch (err) {
    if (esDuplicado(err, 'uq_feriados_fecha')) {
      throw new AppError(
        409,
        'feriado_repetido',
        'Ese día ya está marcado como feriado.',
      );
    }
    throw err;
  }
}

// Los feriados son configuración del calendario: se pueden quitar.
export async function quitarFeriado(tiendaId: TiendaId, id: number) {
  if (!(await feriadosRepo.borrar(tiendaId, id))) {
    throw new AppError(404, 'feriado_no_encontrado', 'No encontramos ese feriado.');
  }
}

export async function estadoTienda(tiendaId: TiendaId) {
  return estadoApertura(await cargarAgenda(tiendaId));
}
