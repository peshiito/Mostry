import { config } from '../../config/env.js';
import { hashearClave } from '../../shared/crypto/claves.js';

// Hash de SEED_CLAVE (.env). Sin ella, los usuarios de prueba no pueden entrar.
export async function claveDelSeed(): Promise<string> {
  return config.SEED_CLAVE ? hashearClave(config.SEED_CLAVE) : '!sin-clave';
}
