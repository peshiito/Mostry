import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { leerCarrito } from './lib/carritoGuardado.js';

export const Carrito = createContext(null);

// Carrito por tienda en sessionStorage (no es dato sensible; el servidor
// recalcula precios y total en el checkout, sección 6.1).
export function CarritoProveedor({ slug, children }) {
  const clave = `carrito:${slug}`;
  const [items, setItems] = useState(() => leerCarrito(clave));
  useEffect(() => {
    try {
      sessionStorage.setItem(clave, JSON.stringify(items));
    } catch {
      /* sin storage (modo privado): el carrito vive en memoria */
    }
  }, [clave, items]);
  // Estable y sin cambios si ya está vacío (si no, un efecto que vacía haría un bucle).
  const vaciar = useCallback(() => setItems((prev) => (prev.length ? [] : prev)), []);
  const valor = useMemo(() => {
    const cambiar = (producto, delta) =>
      setItems((prev) => {
        const actual = prev.find((i) => i.id === producto.id);
        const cantidad = (actual?.cantidad ?? 0) + delta;
        const resto = prev.filter((i) => i.id !== producto.id);
        if (cantidad <= 0) return resto;
        const { id, nombre, precio, foto, descripcion, aceptaEncargo } = producto;
        const item = { id, nombre, precio, foto, descripcion, aceptaEncargo, cantidad };
        return actual ? prev.map((i) => (i.id === id ? item : i)) : [...prev, item];
      });
    const unidades = items.reduce((s, i) => s + i.cantidad, 0);
    const subtotal = items.reduce((s, i) => s + i.cantidad * i.precio, 0);
    return { items, unidades, subtotal, cambiar, vaciar };
  }, [items, vaciar]);
  return <Carrito.Provider value={valor}>{children}</Carrito.Provider>;
}
