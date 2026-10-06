import { db } from '../../../shared/db/db.js';
import { esDuplicado } from '../../../shared/db/esDuplicado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { cajasRepo, type Caja } from '../repositorios/cajas.repository.js';
import { movimientosRepo } from '../repositorios/movimientos.repository.js';
import { efectivoEsperado, totales } from './cuentas.js';

const hoy = () => enArgentina(new Date()).fecha;

async function conDetalle(tiendaId: TiendaId, caja: Caja) {
  const movimientos = await movimientosRepo.deCaja(tiendaId, caja.id);
  return {
    ...caja,
    movimientos,
    totales: totales(movimientos),
    esperado: efectivoEsperado(caja.montoApertura, movimientos),
  };
}

// Una caja por día. Si quedó una sin cerrar, primero hay que cerrarla (decisión 35).
export async function abrirCaja(tiendaId: TiendaId, montoApertura: number) {
  const abierta = await cajasRepo.abierta(tiendaId);
  if (abierta) {
    const codigo = abierta.fecha === hoy() ? 'caja_ya_abierta' : 'caja_anterior_abierta';
    throw new AppError(409, codigo, 'Primero cerrá la caja que quedó abierta.', {
      fecha: abierta.fecha,
    });
  }
  try {
    await cajasRepo.crear(tiendaId, hoy(), montoApertura);
  } catch (err) {
    // Dos aperturas a la vez: la otra ganó. Se informa lo que realmente pasó.
    if (esDuplicado(err, 'uq_cajas_fecha')) {
      if (await cajasRepo.abierta(tiendaId))
        throw new AppError(409, 'caja_ya_abierta', 'La caja de hoy ya está abierta.');
      throw new AppError(409, 'caja_ya_cerrada_hoy', 'La caja de hoy ya se cerró.');
    }
    throw err;
  }
  return verCajaActual(tiendaId);
}

// La abierta (de hoy o una vieja sin cerrar) o, si no hay, la de hoy ya cerrada.
export async function verCajaActual(tiendaId: TiendaId) {
  const caja =
    (await cajasRepo.abierta(tiendaId)) ?? (await cajasRepo.delDia(tiendaId, hoy()));
  return caja ? conDetalle(tiendaId, caja) : null;
}

// Cierre: diferencia = contado − esperado (positiva sobra, negativa falta).
export async function cerrarCaja(tiendaId: TiendaId, montoContado: number) {
  const id = await db.transaction().execute(async (tx) => {
    const caja = await cajasRepo.abierta(tiendaId, tx);
    if (!caja)
      throw new AppError(409, 'sin_caja_abierta', 'No hay ninguna caja abierta.');
    const esperado = efectivoEsperado(
      caja.montoApertura,
      await movimientosRepo.deCaja(tiendaId, caja.id, tx),
    );
    await cajasRepo.cerrar(tx, tiendaId, caja.id, montoContado, montoContado - esperado);
    return caja.id;
  });
  const cerrada = (await cajasRepo.historial(tiendaId, 5)).find((c) => c.id === id)!;
  return conDetalle(tiendaId, cerrada);
}

export const historialCajas = (tiendaId: TiendaId) => cajasRepo.historial(tiendaId, 60);
