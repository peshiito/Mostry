import { useEffect, useState } from 'react';
import { useConsulta } from '../../../shared/api/useConsulta.js';

// Productos para vender: el servidor busca y filtra por categoría (así entran
// todos, no solo la primera página). La búsqueda espera a que dejes de escribir.
export function useProductosVender(texto, categoria) {
  const [buscado, setBuscado] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setBuscado(texto.trim()), 250);
    return () => clearTimeout(t);
  }, [texto]);
  const q = new URLSearchParams({ estado: 'activos' });
  if (buscado) q.set('buscar', buscado);
  if (categoria !== 'todo') q.set('categoriaId', categoria);
  const prod = useConsulta(`/panel/productos?${q}`);
  return {
    productos: prod.datos?.productos ?? [],
    // Solo la primera vez: al buscar se siguen viendo los anteriores.
    cargando: prod.cargando && !prod.datos,
    error: prod.error,
    recargar: prod.recargar,
  };
}
