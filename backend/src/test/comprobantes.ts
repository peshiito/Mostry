import type { Express } from 'express';
import request from 'supertest';
import { db } from '../shared/db/db.js';
import { origenTienda } from './sesionHttp.js';

export const pdfMinimo = () =>
  Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n');

// El comprador sube el comprobante desde su link de seguimiento.
export const subirComprobante = (
  app: Express,
  slug: string,
  token: string,
  datos: Buffer,
  nombre = 'comprobante.jpg',
) =>
  request(app)
    .post(`/publico/pedidos/${token}/comprobante`)
    .set('Origin', origenTienda(slug))
    .attach('comprobante', datos, { filename: nombre, contentType: 'image/jpeg' });

export const idPedido = async (numero = 1) =>
  (
    await db
      .selectFrom('pedidos')
      .select('id')
      .where('numero', '=', numero)
      .executeTakeFirstOrThrow()
  ).id;

export const datosAprobacion = (monto: number) => ({
  monto,
  fechaOperacion: new Date().toISOString(),
  titular: 'Ana Pérez',
  numeroOperacion: '000123456',
});
