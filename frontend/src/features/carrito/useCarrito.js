import { useContext } from 'react';
import { Carrito } from './CarritoContexto.jsx';

export function useCarrito() {
  const c = useContext(Carrito);
  if (!c) throw new Error('useCarrito fuera de <CarritoProveedor>');
  return c;
}
