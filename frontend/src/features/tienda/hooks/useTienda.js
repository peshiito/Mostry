import { useContext } from 'react';
import { Tienda } from '../TiendaContexto.jsx';

// Datos públicos de la tienda + estado de atención (abierta, cerrada o suspendida).
export function useTienda() {
  const t = useContext(Tienda);
  if (!t) throw new Error('useTienda fuera de <TiendaProveedor>');
  return t;
}
