import type { RequestHandler } from 'express';
import { db } from '../../../shared/db/db.js';
import {
  esquemaAbrir,
  esquemaCerrar,
  esquemaMovimiento,
  esquemaPeriodo,
} from '../schemas.js';
import {
  abrirCaja,
  cerrarCaja,
  historialCajas,
  verCajaActual,
} from '../servicios/caja.service.js';
import { registrarMovimiento } from '../servicios/registrarMovimiento.js';
import { resumenPeriodo } from '../servicios/resumen.service.js';

const actual: RequestHandler = async (req, res) => {
  res.json(await verCajaActual(req.tienda!.id));
};

const abrir: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(await abrirCaja(req.tienda!.id, esquemaAbrir.parse(req.body).montoApertura));
};

const cerrar: RequestHandler = async (req, res) => {
  res.json(await cerrarCaja(req.tienda!.id, esquemaCerrar.parse(req.body).montoContado));
};

const movimiento: RequestHandler = async (req, res) => {
  const datos = esquemaMovimiento.parse(req.body);
  await db
    .transaction()
    .execute((tx) =>
      registrarMovimiento(tx, req.tienda!.id, { ...datos, origen: 'manual' }),
    );
  res.status(201).json(await verCajaActual(req.tienda!.id));
};

const resumen: RequestHandler = async (req, res) => {
  const { desde, hasta } = esquemaPeriodo.parse(req.query);
  res.json(await resumenPeriodo(req.tienda!.id, desde, hasta));
};

const historial: RequestHandler = async (req, res) => {
  res.json(await historialCajas(req.tienda!.id));
};

export const cajaController = { actual, abrir, cerrar, movimiento, resumen, historial };
