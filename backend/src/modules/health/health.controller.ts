import type { RequestHandler } from 'express';

// 200 si la API y la base responden; 503 si la base está caída.
export function crearHealthController(pingDb: () => Promise<void>): RequestHandler {
  return async (req, res) => {
    try {
      await pingDb();
      res.json({ estado: 'ok', db: 'ok' });
    } catch (err) {
      req.log.warn({ err }, 'Health: la base no responde');
      res.status(503).json({ estado: 'degradado', db: 'caida' });
    }
  };
}
