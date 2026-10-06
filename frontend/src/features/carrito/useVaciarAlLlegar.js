import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useCarrito } from './useCarrito.js';

// El carrito se vacía cuando llegamos al pago/seguimiento de un pedido recién creado
// (si se vaciara en el checkout, el checkout vacío redirigiría al carrito).
export function useVaciarAlLlegar() {
  const { state } = useLocation();
  const { vaciar } = useCarrito();
  const recien = state?.recienCreado;
  useEffect(() => {
    if (recien) vaciar();
  }, [recien, vaciar]);
}
