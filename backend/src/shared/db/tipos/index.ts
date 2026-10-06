import type { ArchivosPorBorrarTabla, AvisosSuscripcionTabla } from './archivos.js';
import type {
  CajasTabla,
  GastosTabla,
  MovimientosCajaTabla,
  ProveedoresTabla,
} from './caja.js';
import type * as C from './catalogo.js';
import type * as L from './libreta.js';
import type * as P from './pedidos.js';
import type * as T from './tiendas.js';
import type * as U from './usuarios.js';

// Esquema completo para Kysely (nombres en camelCase por el CamelCasePlugin).
export interface Database {
  usuarios: U.UsuariosTabla;
  codigosEmail: U.CodigosEmailTabla;
  sesiones: U.SesionesTabla;
  tiendas: T.TiendasTabla;
  miembrosTienda: T.MiembrosTiendaTabla;
  pagosSuscripcion: T.PagosSuscripcionTabla;
  categorias: C.CategoriasTabla;
  productos: C.ProductosTabla;
  productoFotos: C.ProductoFotosTabla;
  horarios: C.HorariosTabla;
  feriados: C.FeriadosTabla;
  promociones: C.PromocionesTabla;
  pedidos: P.PedidosTabla;
  pedidoItems: P.PedidoItemsTabla;
  comprobantes: P.ComprobantesTabla;
  cajas: CajasTabla;
  movimientosCaja: MovimientosCajaTabla;
  proveedores: ProveedoresTabla;
  gastos: GastosTabla;
  clientesLibreta: L.ClientesLibretaTabla;
  movimientosFiado: L.MovimientosFiadoTabla;
  notas: L.NotasTabla;
  archivosPorBorrar: ArchivosPorBorrarTabla;
  avisosSuscripcion: AvisosSuscripcionTabla;
}
