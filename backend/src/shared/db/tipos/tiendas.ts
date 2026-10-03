import type { Auto, Creado, Fecha, Timestamps } from './comunes.js';

export type EstadoTienda = 'prueba' | 'activa' | 'gracia' | 'suspendida';

export type TiendasTabla = Timestamps & {
  id: Auto<number>;
  slug: string;
  nombre: string;
  frase: string | null;
  logoClave: string | null;
  paleta: Auto<string>;
  alias: string | null;
  titularAlias: string | null;
  whatsapp: string | null;
  direccion: string | null;
  estado: Auto<EstadoTienda>;
  pruebaHasta: Date | null;
  planHasta: Date | null;
  pausada: Auto<boolean>;
  plazoComprobanteHoras: Auto<number>;
  plazoSenaHoras: Auto<number>;
  anticipacionEncargoHoras: Auto<number>;
  senaPorcentaje: Auto<number>;
  costoEnvio: Auto<number>;
  zonaEnvio: string | null;
  ultimoNumeroPedido: Auto<number>;
};

export type MiembrosTiendaTabla = Creado & {
  tiendaId: number;
  usuarioId: number;
  rol: Auto<'dueno' | 'empleado'>;
};

export type PagosSuscripcionTabla = Creado & {
  id: Auto<number>;
  tiendaId: number;
  monto: number;
  pagadoEn: Fecha;
  periodoDesde: Date;
  periodoHasta: Date;
  registradoPor: number;
  nota: string | null;
};
