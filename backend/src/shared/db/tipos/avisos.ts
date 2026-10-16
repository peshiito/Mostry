import type { Auto, Creado, DeTienda, Hora } from './comunes.js';

// Avisos 1 (0051): teléfonos con avisos activados y la cola de avisos.
export type SuscripcionesPushTabla = DeTienda &
  Creado & {
    usuarioId: number;
    endpoint: string;
    p256dh: string;
    auth: string;
    dispositivo: string | null;
    fallos: Auto<number>;
    ultimoUsoEn: Auto<Date>;
  };

export type TipoAviso = 'pedido_nuevo' | 'encargo_nuevo' | 'comprobante' | 'resumen';

export type AvisosPushTabla = DeTienda &
  Creado & {
    tipo: TipoAviso;
    pedidoId: number | null;
    clave: string;
    reclamadoEn: Date | null;
    enviadoEn: Date | null;
    intentos: Auto<number>;
  };

// Horario de silencio de cada miembro (los avisos llegan sin sonido).
export type SilencioMiembro = { silencioDesde: Hora | null; silencioHasta: Hora | null };
