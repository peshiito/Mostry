import webpush from 'web-push';
import { config } from '../../config/env.js';

export type DestinoPush = { endpoint: string; p256dh: string; auth: string };
export type ContenidoPush = {
  titulo: string;
  cuerpo: string;
  url: string; // ruta del panel (el aviso abre la tienda donde se activó)
  tag: string; // el mismo pedido reemplaza su aviso en vez de apilarlos
  silencioso: boolean;
  pendientes: number; // el número en el ícono de la app
};
export type ResultadoPush = 'ok' | 'no_existe' | 'sin_configurar';

const HORA_S = 3600;

// Único lugar que habla con los servicios de push (los tests lo reemplazan).
// Sin claves VAPID no se manda nada. 404/410: ese teléfono ya no existe.
export const transportePush = {
  async enviar(d: DestinoPush, c: ContenidoPush): Promise<ResultadoPush> {
    const { VAPID_PUBLICA, VAPID_PRIVADA, VAPID_CONTACTO } = config;
    if (!VAPID_PUBLICA || !VAPID_PRIVADA) return 'sin_configurar';
    try {
      await webpush.sendNotification(
        { endpoint: d.endpoint, keys: { p256dh: d.p256dh, auth: d.auth } },
        JSON.stringify(c),
        {
          vapidDetails: {
            subject: VAPID_CONTACTO ?? 'mailto:hola@mostry.com.ar',
            publicKey: VAPID_PUBLICA,
            privateKey: VAPID_PRIVADA,
          },
          TTL: 6 * HORA_S, // apagado más de 6 h: el aviso viejo ya no sirve
          urgency: 'high',
          topic: c.tag.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32),
          timeout: 10_000,
        },
      );
      return 'ok';
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) return 'no_existe';
      throw err;
    }
  },
};
