import type { CorsOptions } from 'cors';
import { esOrigenPermitido } from '../utils/origen.js';

// Solo mostry.com.ar, *.mostry.com.ar y los orígenes de desarrollo.
export const opcionesCors: CorsOptions = {
  origin: (origen, listo) => listo(null, esOrigenPermitido(origen)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  maxAge: 600,
};
