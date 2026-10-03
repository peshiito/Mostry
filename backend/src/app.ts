import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { rutasHealth } from './modules/health/health.routes.js';
import { logger } from './shared/logger.js';
import { manejarErrores } from './shared/middlewares/manejarErrores.js';
import { opcionesCors } from './shared/middlewares/opcionesCors.js';
import { rutaNoEncontrada } from './shared/middlewares/rutaNoEncontrada.js';
import { verificarOrigen } from './shared/middlewares/verificarOrigen.js';

export type Dependencias = { pingDb: () => Promise<void> };

// Arma la app sin escuchar en ningún puerto (los tests la usan directo).
export function crearApp(deps: Dependencias): Express {
  const app = express();
  app.disable('x-powered-by');

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

  app.use('/health', rutasHealth(deps.pingDb));

  app.use(rutaNoEncontrada);
  app.use(manejarErrores);
  return app;
}
