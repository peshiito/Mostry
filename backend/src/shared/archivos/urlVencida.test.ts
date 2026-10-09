import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { describe, expect, it } from 'vitest';
import { config } from '../../config/env.js';
import { s3 } from './clienteS3.js';
import { subirPrivado, urlFirmada, VIGENCIA_URL_S } from './privado.js';

// Una URL firmada de un comprobante sirve 5 minutos y después no (sección 7).
// Para no esperar, se firma una URL "emitida" hace un rato con la misma vigencia.
describe('URL firmada de un comprobante', () => {
  const clave = `tiendas/test/vencida-${Date.now()}.pdf`;
  const firmarHace = (segundos: number) =>
    getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: config.S3_BUCKET_PRIVADO, Key: clave }),
      {
        expiresIn: VIGENCIA_URL_S,
        signingDate: new Date(Date.now() - segundos * 1000),
      },
    );

  it('recién emitida se descarga; vencida (o con la firma tocada) se rechaza', async () => {
    await subirPrivado(clave, Buffer.from('%PDF-1.4 prueba'), 'application/pdf');
    expect((await fetch(await urlFirmada(clave, 'pago.pdf'))).status).toBe(200);
    // Emitida hace 4 min: todavía vale. Hace 6 min: ya no.
    expect((await fetch(await firmarHace(4 * 60))).status).toBe(200);
    expect((await fetch(await firmarHace(6 * 60))).status).toBe(403);
    // Estirar la vigencia a mano rompe la firma.
    const estirada = (await urlFirmada(clave, 'pago.pdf')).replace(
      'X-Amz-Expires=300',
      'X-Amz-Expires=86400',
    );
    expect((await fetch(estirada)).status).toBe(403);
  });
});
