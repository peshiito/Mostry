import type { Express } from 'express';
import request from 'supertest';
import { origenTienda } from './sesionHttp.js';
import { pedido, type tiendaLista } from './tiendaLista.js';

type Tienda = Awaited<ReturnType<typeof tiendaLista>>;
const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();
export const PRECIO_TORTA = 3500000;

// Encargos 2: una torta que se personaliza (texto + foto de referencia opcional).
export async function crearTorta(t: Tienda) {
  const res = await t.panel
    .post('/panel/productos', {
      nombre: 'Torta de cumple',
      precio: PRECIO_TORTA,
      pidePersonalizacion: true,
      indicacionPersonalizacion: 'Contanos el texto, el sabor y el relleno',
    })
    .expect(201);
  return res.body.id as number;
}

// Cuerpo de checkout de un encargo de la torta con su personalización.
export function encargoTorta(
  t: Tienda,
  tortaId: number,
  personalizacion: string | undefined = 'Feliz cumple Juan, chocolate',
) {
  const datos = pedido(t.productos, {}, { tipo: 'encargo', fechaEncargo: enDias(3) });
  return {
    ...datos,
    items: [{ productoId: tortaId, cantidad: 1, personalizacion }],
    totalEsperado: PRECIO_TORTA,
  };
}

// El comprador sube la foto de referencia de un ítem desde su link.
export const subirFoto = (
  app: Express,
  slug: string,
  token: string,
  itemId: number,
  datos: Buffer,
) =>
  request(app)
    .post(`/publico/pedidos/${token}/items/${itemId}/foto`)
    .set('Origin', origenTienda(slug))
    .attach('foto', datos, { filename: 'torta.png', contentType: 'image/png' });
