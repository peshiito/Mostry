import { urlAdmin, urlTienda } from '../../../shared/lib/urls.js';

// Después de entrar desde la landing: el admin va a su dashboard y el comerciante
// a su panel. Con varias tiendas devuelve la lista para que elija (no navega).
export function irAlDestino(destino, ir = (url) => window.location.assign(url)) {
  if (destino?.zona === 'admin') return ir(urlAdmin('/'));
  if (destino?.zona !== 'tiendas') return null;
  if (destino.tiendas.length === 1)
    return ir(urlTienda(destino.tiendas[0].slug, '/panel'));
  return destino.tiendas;
}
