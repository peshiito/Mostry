import { PALETAS } from '../../shared/lib/paletas.js';

// Contenido visual de la landing: capturas reales de Mostry en local con
// comercios de ejemplo (public/landing). Cada local usa su paleta de verdad.
const local = (id, nombre, rubro, paleta, dominio, uso) => ({
  id,
  nombre,
  rubro,
  dominio,
  uso,
  color: PALETAS[paleta].principal,
  acento: PALETAS[paleta].acento,
});

export const LOCALES = [
  local(
    'espiga',
    'La Espiga',
    'Facturería',
    'toldo',
    'la-espiga',
    'Toma encargos de tortas con seña y fecha de retiro.',
  ),
  local(
    'ropa',
    'Ropa Mía',
    'Indumentaria',
    'frambuesa',
    'ropa-mia',
    'Sabe qué talle reponer antes de quedarse sin stock.',
  ),
  local(
    'tita',
    'Doña Tita',
    'Almacén',
    'tomate',
    'almacen-dona-tita',
    'Lleva la libreta de fiados sin perder una cuenta.',
  ),
  local(
    'tito',
    'Don Tito',
    'Verdulería',
    'oliva',
    'verduleria-don-tito',
    'Hace envíos en el barrio y cierra la caja sin cuaderno.',
  ),
  local(
    'polo',
    'Polo',
    'Heladería',
    'cielo',
    'heladeria-polo',
    'Aprueba los pagos y avisa por WhatsApp cuando sale el pedido.',
  ),
];
