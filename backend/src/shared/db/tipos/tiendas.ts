import type { TemaTienda } from '../../../modules/tiendas/tema/esquemaTema.js';
import type { ContenidoTienda } from '../../../modules/tiendas/vidriera/esquemaContenido.js';
import type { ModoStock } from './catalogo.js';
import type { Auto, ColTienda, Creado, Hora, Json, Timestamps } from './comunes.js';

export type EstadoTienda = 'prueba' | 'activa' | 'gracia' | 'suspendida';

export type TiendasTabla = Timestamps & {
  id: Auto<number>;
  slug: string;
  nombre: string;
  frase: string | null;
  logoClave: string | null;
  paleta: Auto<string>;
  // Vidriera 2.0: tema (0054; null = su paleta), portada y contenido (0055).
  tema: Json<TemaTienda>;
  portadaClave: string | null;
  contenido: Json<ContenidoTienda>;
  alias: string | null;
  titularAlias: string | null;
  whatsapp: string | null;
  direccion: string | null;
  estado: Auto<EstadoTienda>;
  pruebaHasta: Date | null;
  planHasta: Date | null;
  suspendidaManual: Auto<boolean>;
  motivoSuspension: string | null;
  pausada: Auto<boolean>;
  plazoComprobanteHoras: Auto<number>;
  plazoSenaHoras: Auto<number>;
  anticipacionEncargoHoras: Auto<number>;
  cupoEncargosDia: number | null; // máximo de encargos por día (0049)
  senaPorcentaje: Auto<number>;
  costoEnvio: Auto<number>;
  aceptaEnvio: Auto<boolean>;
  aceptaRetiro: Auto<boolean>;
  zonaEnvio: string | null;
  ultimoNumeroPedido: Auto<number>;
  modoStock: Auto<ModoStock>; // forma por defecto para productos nuevos
  // Perfil del negocio (0041): qué partes de Mostry usa. Null = todavía no
  // contestó las preguntas del inicio.
  vendeOnline: Auto<boolean>;
  usaEncargos: Auto<boolean>;
  usaLibreta: Auto<boolean>;
  usaGastos: Auto<boolean>;
  rubro: string | null;
  configuradaEn: Date | null;
  ultimoNumeroVenta: Auto<number>;
  usaClub: Auto<boolean>; // Club de clientes (0045)
};

export type MiembrosTiendaTabla = Creado & {
  tiendaId: ColTienda;
  usuarioId: number;
  rol: Auto<'dueno' | 'empleado'>;
  silencioDesde: Auto<Hora | null>; // avisos sin sonido (Avisos 1, 0051)
  silencioHasta: Auto<Hora | null>;
};

export type { PagosSuscripcionTabla } from './pagosSuscripcion.js';
