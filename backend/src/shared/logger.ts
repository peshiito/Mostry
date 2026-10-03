import { pino } from 'pino';
import { config } from '../config/env.js';

// Nunca loguear cookies ni credenciales.
export const logger = pino({
  level: config.LOG_NIVEL,
  redact: [
    'req.headers.cookie',
    'req.headers.authorization',
    'res.headers["set-cookie"]',
  ],
  ...(config.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty', options: { translateTime: 'SYS:HH:MM:ss' } },
  }),
});
