import { useState } from 'react';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { FILTROS, filtrar } from '../lib/filtros.js';

// Lista de pedidos (GET /panel/pedidos?pagina=N), filtrada y contada en el navegador.
export function usePedidosPanel(filtro, busqueda) {
  const [pagina, setPagina] = useState(1);
  const { datos, cargando, error, recargar } = useConsulta(
    `/panel/pedidos?pagina=${pagina}`,
  );
  const todos = (datos?.pedidos ?? []).map((p) => ({ ...p, cliente: p.clienteNombre }));
  const q = busqueda.trim().toLowerCase();
  const visibles = filtrar(todos, filtro).filter(
    (p) => !q || p.cliente.toLowerCase().includes(q) || String(p.numero).includes(q),
  );
  const filtros = FILTROS.map((f) => ({ ...f, cuenta: filtrar(todos, f.valor).length }));
  const paginas = datos?.paginas ?? 1;
  return {
    pedidos: visibles,
    filtros,
    total: datos?.total ?? 0,
    cargando,
    error,
    recargar,
    pagina,
    paginas,
    setPagina,
  };
}
