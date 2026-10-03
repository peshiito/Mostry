import { config } from '../../config/env.js';
import { zonaDesdeOrigen, type Zona } from './zonaDesdeOrigen.js';

export function zonaDelOrigen(origen: string | undefined): Zona | null {
  return zonaDesdeOrigen(origen, config.DOMINIO_BASE, config.ORIGEN_PROTOCOLO);
}

export function esOrigenPermitido(origen: string | undefined): boolean {
  return zonaDelOrigen(origen) !== null;
}
