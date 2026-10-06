import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../../config/env.js';

// Mismo código para RustFS (local) y Cloudflare R2 (producción): cambian las variables S3_*.
export const s3 = new S3Client({
  endpoint: config.S3_ENDPOINT,
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_KEY,
  },
  // Rutas tipo endpoint/bucket/clave: las aceptan RustFS y R2.
  forcePathStyle: true,
  // Sin esto, una request colgada a S3 frena una tarea del worker para siempre.
  requestHandler: { connectionTimeout: 10_000, requestTimeout: 60_000 },
});
