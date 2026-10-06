import { beforeEach, describe, expect, it } from 'vitest';
import { config } from '../../../config/env.js';
import { db } from '../../../shared/db/db.js';
import { privadosBajo } from '../../../test/bucket.js';
import { idPedido, pdfMinimo, subirComprobante } from '../../../test/comprobantes.js';
import { maliciosos } from '../../../test/imagenes.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('comprobantes: archivos privados', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let token: string;

  beforeEach(async () => {
    t = await tiendaLista();
    token = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
        .expect(201)
    ).body.token;
  });

  it('PDF: se guarda privado y solo se ve con URL firmada de 5 min, como descarga', async () => {
    await subirComprobante(t.app, 'dona-rosa', token, pdfMinimo(), 'pago.pdf').expect(
      201,
    );
    const id = await idPedido();
    const [c] = (await t.panel.get(`/panel/pedidos/${id}/comprobantes`)).body;
    const { url } = (
      await t.panel.get(`/panel/pedidos/${id}/comprobantes/${c.id}/archivo`).expect(200)
    ).body;
    expect(url).toContain('X-Amz-Expires=300');
    const descarga = await fetch(url);
    expect(descarga.status).toBe(200);
    expect(descarga.headers.get('content-disposition')).toMatch(/^attachment;/);
    // Sin firma, el bucket privado no lo entrega.
    const [clave] = await privadosBajo('tiendas/');
    expect(
      (await fetch(`${config.S3_ENDPOINT}/${config.S3_BUCKET_PRIVADO}/${clave}`)).status,
    ).toBe(403);
  });

  it('rechaza SVG, HTML disfrazado y PDFs truncados; no sube nada', async () => {
    for (const datos of [
      maliciosos.svgConScript,
      maliciosos.poliglota,
      Buffer.from('%PDF-1.4 sin final'),
    ]) {
      expect((await subirComprobante(t.app, 'dona-rosa', token, datos)).status).toBe(400);
    }
    expect(await privadosBajo('tiendas/')).toEqual([]);
  });

  it('con el plazo vencido ya no se puede subir', async () => {
    await db
      .updateTable('pedidos')
      .set({ venceComprobanteEn: new Date(Date.now() - 1000) })
      .execute();
    expect(
      (await subirComprobante(t.app, 'dona-rosa', token, pdfMinimo(), 'pago.pdf')).body
        .error.codigo,
    ).toBe('plazo_vencido');
  });
});
