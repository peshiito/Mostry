import type { Request } from 'express';
import { limite } from '../../shared/http/rateLimit.js';
import { crearLimites } from '../auth/limites.js';

// Por cliente: va DESPUÉS de requerirCliente.
const porCliente = (req: Request) => `cliente:${req.cliente?.clienteId ?? 'anonimo'}`;

// Los mismos límites que el panel (login, registro y códigos) más los del club.
export function crearLimitesClub() {
  return {
    ...crearLimites(),
    // El QR rota cada 5 minutos: 60 en 15 minutos cubre cambiar de pestaña y dos celulares.
    qr: limite(15, 60, porCliente),
    claveCliente: limite(15, 5, porCliente),
  };
}
