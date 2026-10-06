import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { adaptarTiendaAdmin, adminApi } from '../api/admin.js';

// Tiendas con búsqueda y filtro por estado (GET /admin/tiendas). Los totales por
// estado salen de las métricas.
export function useTiendasAdmin() {
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('todas');
  const [pagina, setPagina] = useState(1);
  const params = new URLSearchParams({ pagina: String(pagina) });
  if (q.trim()) params.set('buscar', q.trim());
  if (estado !== 'todas') params.set('estado', estado);
  const lista = useConsulta(`/admin/tiendas?${params}`);
  const metricas = useConsulta('/admin/metricas');
  const porEstado = metricas.datos?.tiendas.porEstado ?? {};
  return {
    tiendas: (lista.datos?.tiendas ?? []).map((t) => adaptarTiendaAdmin(t)),
    total: metricas.datos?.tiendas.total ?? 0,
    cuenta: (e) => porEstado[e] ?? 0,
    cargando: lista.cargando,
    q,
    setQ: (v) => (setQ(v), setPagina(1)),
    estado,
    setEstado: (v) => (setEstado(v), setPagina(1)),
    pagina,
    paginas: lista.datos?.paginas ?? 1,
    setPagina,
  };
}

// Detalle de una tienda + registrar pago, suspender y reactivar.
export function useTiendaAdmin(id) {
  const { datos, cargando, recargar } = useConsulta(`/admin/tiendas/${Number(id) || 0}`);
  // El segundo argumento de ejecutar() es el texto del aviso (sin texto, no avisa).
  const accion = useAccion(
    async (fn) => {
      await fn();
      recargar();
    },
    { exito: (_, _fn, texto) => texto },
  );
  return {
    tienda: datos ? adaptarTiendaAdmin(datos.tienda, datos) : null,
    cargando,
    accion,
    registrarPago: (d) =>
      accion.ejecutar(
        () => adminApi.registrarPago(id, d),
        'Pago registrado: plan extendido',
      ),
    suspender: (motivo) =>
      accion.ejecutar(() => adminApi.suspender(id, motivo), 'Tienda suspendida'),
    reactivar: () => accion.ejecutar(() => adminApi.reactivar(id), 'Tienda reactivada'),
  };
}
