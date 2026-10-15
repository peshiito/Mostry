import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import { eliminarTienda } from '../eliminar/eliminar.service.js';
import { esquemaId } from '../schemas.js';
import { claveTemporal, reenviarMail } from './ayudaClave.service.js';
import { cambiarDueno, corregirTienda } from './ayudaCuenta.service.js';
import { esquemaDatosTienda, esquemaDueno, esquemaEliminar } from './schemas.js';

// Ayuda del admin con la cuenta de una tienda, y eliminación (Mejoras 4).
export function ayudaController(mailer: Mailer) {
  const id = (req: Parameters<RequestHandler>[0]) => esquemaId.parse(req.params.id);
  const admin = (req: Parameters<RequestHandler>[0]) => req.sesion!.usuarioId;
  const dueno: RequestHandler = async (req, res) => {
    res.json(await cambiarDueno(id(req), admin(req), esquemaDueno.parse(req.body)));
  };
  const datos: RequestHandler = async (req, res) => {
    res.json(
      await corregirTienda(id(req), admin(req), esquemaDatosTienda.parse(req.body)),
    );
  };
  const clave: RequestHandler = async (req, res) => {
    // Va una sola vez y sin caché: es una contraseña.
    res.set('Cache-Control', 'no-store').json(await claveTemporal(id(req), admin(req)));
  };
  const mail: RequestHandler = async (req, res) => {
    res.json(await reenviarMail(id(req), admin(req), mailer));
  };
  const eliminar: RequestHandler = async (req, res) => {
    res.json(await eliminarTienda(id(req), admin(req), esquemaEliminar.parse(req.body)));
  };
  return { dueno, datos, clave, mail, eliminar };
}
