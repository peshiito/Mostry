import { createPool, type Pool } from 'mysql2';
import { config } from '../../config/env.js';

// BOOLEAN de MySQL es TINYINT(1): lo devolvemos como true/false.
// DATE sale como 'YYYY-MM-DD' (sin hora ni zona); DATETIME, como Date en UTC.
export function crearPool(): Pool {
  return createPool({
    host: config.DB_HOST,
    port: config.DB_PUERTO,
    user: config.DB_USUARIO,
    password: config.DB_CLAVE,
    database: config.nombreBase,
    connectionLimit: 10,
    timezone: 'Z',
    dateStrings: ['DATE'],
    supportBigNumbers: true,
    typeCast: (campo, siguiente) => {
      if (campo.type === 'TINY' && campo.length === 1) {
        const valor = campo.string();
        return valor === null ? null : valor === '1';
      }
      return siguiente();
    },
  });
}
