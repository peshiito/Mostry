import { createContext, useContext, useMemo } from 'react';
import { AJUSTES_BASE } from './lib/bases.js';

const Ajustes = createContext(AJUSTES_BASE);

// Los ajustes de la página ("Armá tu página", P4): carrito, buscador y la
// tarjeta de producto. Lo usan la vidriera y la vista previa del editor.
export function AjustesProveedor({ ajustes, children }) {
  const valor = useMemo(
    () => ({
      ...AJUSTES_BASE,
      ...ajustes,
      tarjeta: { ...AJUSTES_BASE.tarjeta, ...ajustes?.tarjeta },
    }),
    [ajustes],
  );
  return <Ajustes.Provider value={valor}>{children}</Ajustes.Provider>;
}

export const useAjustes = () => useContext(Ajustes);
