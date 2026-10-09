import { Router, type RequestHandler } from 'express';
import { recibirArchivo } from '../../shared/archivos/recibirArchivo.js';
import { tiendaDelPanel } from '../../shared/http/contextoPanel.js';
import { limite } from '../../shared/http/rateLimit.js';
import { logoController as logo } from '../tiendas/controladores/logo.controller.js';
import { esquemaConfig } from '../tiendas/schemas.js';
import { editarConfig, verConfig } from '../tiendas/servicios/config.service.js';

// En modo soporte, los datos de cobro no se ven ni se tocan (son del comercio).
const sinCobro = ({
  alias: _a,
  titularAlias: _t,
  ...resto
}: Awaited<ReturnType<typeof verConfig>>) => resto;

const ver: RequestHandler = async (req, res) => {
  res.json(sinCobro(await verConfig(tiendaDelPanel(req))));
};
const editar: RequestHandler = async (req, res) => {
  res.json(
    sinCobro(await editarConfig(tiendaDelPanel(req), esquemaConfig.parse(req.body))),
  );
};

// "Mi tienda" reducido: datos y apariencia, y logo. Sin cobro, pausa ni suscripción.
export function rutasTiendaSoporte(): Router {
  const r = Router();
  r.get('/config', ver);
  r.patch('/config', editar);
  r.put('/logo', limite(10, 20), recibirArchivo('logo'), logo.subir);
  r.delete('/logo', logo.quitar);
  return r;
}
