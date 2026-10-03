import { randomUUID } from 'node:crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { config } from './config/env.js';
import { rutasAdmin } from './modules/admin/admin.routes.js';
import { rutasAuth } from './modules/auth/auth.routes.js';
import { rutasHealth } from './modules/health/health.routes.js';
import { rutasTienda } from './modules/tiendas/tiendas.routes.js';
import type { Mailer } from './shared/email/mailer.js';
import { logger } from './shared/logger.js';
import { manejarErrores } from './shared/middlewares/manejarErrores.js';
import { opcionesCors } from './shared/middlewares/opcionesCors.js';
import { rutaNoEncontrada } from './shared/middlewares/rutaNoEncontrada.js';
import { verificarOrigen } from './shared/middlewares/verificarOrigen.js';

export type Dependencias = { pingDb: () => Promise<void>; mailer: Mailer };

// Arma la app sin escuchar en ningún puerto (los tests la usan directo).
export function crearApp(deps: Dependencias): Express {
  const app = express();
  app.disable('x-powered-by');
  // Cuántos proxies hay delante: sin esto, req.ip sería la IP del proxy.
  app.set('trust proxy', config.TRUST_PROXY);

  app.use(pinoHttp({ logger, genReqId: () => randomUUID() }));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
      },
    }),
  );
  app.use(cors(opcionesCors));
  app.use(verificarOrigen);
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  app.use('/health', rutasHealth(deps.pingDb));
  app.use('/auth', rutasAuth(deps.mailer));
  app.use('/tienda', rutasTienda(deps.mailer));
  app.use('/admin', rutasAdmin());

  app.use(rutaNoEncontrada);
  app.use(manejarErrores);
  return app;
}
