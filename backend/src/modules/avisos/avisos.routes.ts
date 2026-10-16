import { Router, type RequestHandler } from 'express';
import { config } from '../../config/env.js';
import { tiendaDelPanel } from '../../shared/http/contextoPanel.js';
import { miembroDelPanel } from '../../shared/http/miembroDelPanel.js';
import { limite, porUsuario } from '../../shared/http/rateLimit.js';
import { probarAvisos } from './probar.js';
import { esquemaBaja, esquemaSilencio, esquemaSuscripcion } from './esquemas.js';
import { silencioRepo } from './silencio.repository.js';
import { suscripcionesRepo } from './suscripciones.repository.js';

// El miembro de la tienda (el modo soporte del admin no activa avisos: 403).
const miembro = (req: Parameters<RequestHandler>[0]) => ({
  tiendaId: tiendaDelPanel(req),
  usuarioId: miembroDelPanel(req),
});

const estado: RequestHandler = async (req, res) => {
  const m = miembro(req);
  res.json({
    configurado: Boolean(config.VAPID_PUBLICA && config.VAPID_PRIVADA),
    clavePublica: config.VAPID_PUBLICA ?? null,
    telefonos: await suscripcionesRepo.contar(m),
    silencio: await silencioRepo.ver(m),
  });
};

const alta: RequestHandler = async (req, res) => {
  const m = miembro(req);
  await suscripcionesRepo.guardar(m, esquemaSuscripcion.parse(req.body));
  res.status(201).json({ telefonos: await suscripcionesRepo.contar(m) });
};

const baja: RequestHandler = async (req, res) => {
  await suscripcionesRepo.borrar(miembro(req), esquemaBaja.parse(req.body).endpoint);
  res.status(204).end();
};

const silencio: RequestHandler = async (req, res) => {
  const m = miembro(req);
  await silencioRepo.guardar(m, esquemaSilencio.parse(req.body));
  res.json(await silencioRepo.ver(m));
};

const probar: RequestHandler = async (req, res) => {
  const m = miembro(req);
  res.json(await probarAvisos(m.tiendaId, m.usuarioId));
};

// Avisos 1: notificaciones push al teléfono del comercio (rutas del panel).
export function rutasAvisos(): Router {
  return Router()
    .get('/avisos', estado)
    .post('/avisos/suscripciones', alta)
    .post('/avisos/suscripciones/baja', baja)
    .put('/avisos/silencio', silencio)
    .post('/avisos/probar', limite(10, 5, porUsuario), probar);
}
