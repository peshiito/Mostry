import { limite, porEmail } from '../../shared/http/rateLimit.js';

// Se crean por app (cada test arranca con contadores limpios).
// Por IP frena ataques masivos; por email, la fuerza bruta a una cuenta.
export function crearLimites() {
  return {
    loginIp: limite(15, 20),
    loginEmail: limite(15, 5, porEmail),
    registro: limite(60, 5),
    codigosIp: limite(15, 10),
    codigosEmail: limite(15, 5, porEmail),
    totp: limite(10, 10),
  };
}
