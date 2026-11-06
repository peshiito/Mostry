import { useLayoutEffect, useMemo, useSyncExternalStore } from 'react';
import { almacenTema } from '../tema/tema.js';
import { cargarFuentes } from './cargarFuentes.js';
import { derivarTokens } from './derivar.js';

const modoActual = () => document.documentElement.dataset.tema ?? 'claro';

// Aplica el tema de la tienda a toda la página (también a lo que se abre en un
// portal, como las hojas y los avisos): pone los tokens en <html> y los saca al
// salir. Sigue al modo claro u oscuro que elija el comprador.
export function useTemaTienda(tema) {
  const modo = useSyncExternalStore(almacenTema.suscribir, modoActual);
  const tokens = useMemo(() => tema && derivarTokens(tema, modo), [tema, modo]);
  useLayoutEffect(() => {
    if (!tokens) return undefined;
    cargarFuentes([tema.fuentes.titulos, tema.fuentes.texto]);
    const raiz = document.documentElement;
    for (const [nombre, valor] of Object.entries(tokens))
      raiz.style.setProperty(nombre, valor);
    const barra = document.querySelector('meta[name="theme-color"]');
    const antes = barra?.getAttribute('content');
    barra?.setAttribute('content', tokens['--verde']);
    return () => {
      for (const nombre of Object.keys(tokens)) raiz.style.removeProperty(nombre);
      if (antes) barra?.setAttribute('content', antes);
    };
  }, [tokens, tema]);
  return tokens;
}
