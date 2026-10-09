import { createContext, useContext, useMemo } from 'react';
import { crearPanelApi } from './panelApi.js';

// Dónde viven las pantallas del panel. En el panel del comercio: la API en /panel y
// las rutas bajo /panel. En el modo soporte del admin: /admin/soporte/:id y las
// rutas del admin. Así las mismas pantallas sirven en los dos lados sin duplicarlas.
const POR_DEFECTO = { api: '/panel', rutas: '/panel', soporte: false };
const Base = createContext(POR_DEFECTO);

export function BasePanelProveedor({ api, rutas, children }) {
  const valor = useMemo(() => ({ api, rutas, soporte: true }), [api, rutas]);
  return <Base.Provider value={valor}>{children}</Base.Provider>;
}

export const useBasePanel = () => useContext(Base);

// Atajos de la API (get/post/…) con la base que corresponde.
export function usePanelApi() {
  const { api } = useBasePanel();
  return useMemo(() => crearPanelApi(api), [api]);
}
