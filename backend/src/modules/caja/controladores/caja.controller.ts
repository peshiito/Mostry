import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
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
  res.json(await verCajaActual(tiendaDelPanel(req)));
};

const abrir: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      await abrirCaja(tiendaDelPanel(req), esquemaAbrir.parse(req.body).montoApertura),
    );
};

const cerrar: RequestHandler = async (req, res) => {
  res.json(
    await cerrarCaja(tiendaDelPanel(req), esquemaCerrar.parse(req.body).montoContado),
  );
};

const movimiento: RequestHandler = async (req, res) => {
  const datos = esquemaMovimiento.parse(req.body);
  await db
    .transaction()
    .execute((tx) =>
      registrarMovimiento(tx, tiendaDelPanel(req), { ...datos, origen: 'manual' }),
    );
  res.status(201).json(await verCajaActual(tiendaDelPanel(req)));
};

const resumen: RequestHandler = async (req, res) => {
  const { desde, hasta } = esquemaPeriodo.parse(req.query);
  res.json(await resumenPeriodo(tiendaDelPanel(req), desde, hasta));
};

const historial: RequestHandler = async (req, res) => {
  res.json(await historialCajas(tiendaDelPanel(req)));
};

export const cajaController = { actual, abrir, cerrar, movimiento, resumen, historial };
