import { z } from 'zod';

// Id en la URL o el query (llega como texto).
export const esquemaId = z.coerce.number().int().positive();

// Plata en centavos. Tope de $20.000.000: entra holgado en las columnas INT de
// MySQL (incluida la "diferencia" de caja, que lleva signo).
export const PLATA_MAXIMA = 2_000_000_000;
export const plata = z.int().min(0).max(PLATA_MAXIMA);
export const plataPositiva = z.int().min(1).max(PLATA_MAXIMA);
