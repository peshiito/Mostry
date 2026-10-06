import { config } from '../../config/env.js';

export type TipoBucket = 'publico' | 'privado';

// Nombre real del bucket (cambia entre desarrollo, tests y producción).
export const nombreBucket = (tipo: TipoBucket) =>
  tipo === 'publico' ? config.S3_BUCKET_PUBLICO : config.S3_BUCKET_PRIVADO;
